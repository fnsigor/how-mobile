import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { Details } from '@/app/trip/details'
import { linksServer } from '@/server/links-server'
import { participantsServer } from '@/server/participants-server'

/*
Renderização do Componente (should render correctly):

Verifica se os elementos do componente estão sendo renderizados corretamente, incluindo o título das seções e as listas de links e participantes.
Validação de Link Vazio (should show alert if title is empty when creating a link):

Testa se o alerta é mostrado quando o título do link não é preenchido.
Validação de URL Inválido (should show alert if URL is invalid when creating a link):

Testa se o alerta é mostrado quando a URL fornecida é inválida.
Criação de Link e Adição à Lista (should call create link API and add the new link to the list):

Verifica se a API de criação de link é chamada corretamente e se o novo link é exibido na lista de links.
Exibição de Participantes (should fetch and display participants correctly):

Verifica se os participantes são recuperados e exibidos corretamente.
Exibição de Mensagem de Lista Vazia (should show a message when there are no links):

Verifica se a mensagem de "Nenhum link adicionado" é exibida quando não há links.
*/

// Mocking servers
jest.mock('@/server/links-server')
jest.mock('@/server/participants-server')

describe('Details Component', () => {
  const tripId = '12345'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should render correctly', () => {
    const { getByText, getByTestId } = render(<Details tripId={tripId} />)
    
    // Verifica se o título da seção de links está sendo exibido
    expect(getByText('Links importantes')).toBeTruthy()

    // Verifica se o título da seção de participantes está sendo exibido
    expect(getByText('Convidados')).toBeTruthy()

    // Verifica se o botão de "Cadastrar novo link" está presente
    expect(getByText('Cadastrar novo link')).toBeTruthy()

    // Verifica se o FlatList de links e participantes estão presentes
    expect(getByTestId('links-list')).toBeTruthy()
    expect(getByTestId('participants-list')).toBeTruthy()
  })

  test('should show alert if title is empty when creating a link', async () => {
    const { getByText, getByPlaceholderText } = render(<Details tripId={tripId} />)

    // Abertura do modal para criar um link
    fireEvent.press(getByText('Cadastrar novo link'))

    // Preenche o campo URL, mas não o título
    fireEvent.changeText(getByPlaceholderText('Título do link'), '')
    fireEvent.changeText(getByPlaceholderText('URL'), 'https://example.com')

    // Clica no botão "Salvar link"
    fireEvent.press(getByText('Salvar link'))

    await waitFor(() => {
      // Verifica se o alerta de título vazio é chamado
      expect(Alert.alert).toHaveBeenCalledWith(
        'Link',
        'Informe um título para o link.'
      )
    })
  })

  test('should show alert if URL is invalid when creating a link', async () => {
    const { getByText, getByPlaceholderText } = render(<Details tripId={tripId} />)

    // Abertura do modal para criar um link
    fireEvent.press(getByText('Cadastrar novo link'))

    // Preenche o título e a URL inválida
    fireEvent.changeText(getByPlaceholderText('Título do link'), 'Link de exemplo')
    fireEvent.changeText(getByPlaceholderText('URL'), 'invalid-url')

    // Clica no botão "Salvar link"
    fireEvent.press(getByText('Salvar link'))

    await waitFor(() => {
      // Verifica se o alerta de URL inválido é chamado
      expect(Alert.alert).toHaveBeenCalledWith('Link', 'Link inválido!')
    })
  })

  test('should call create link API and add the new link to the list', async () => {
    const mockLinksResponse = [
      { id: '1', title: 'Link 1', url: 'https://example.com' },
      { id: '2', title: 'Link 2', url: 'https://example2.com' }
    ]
    const { getByText, getByPlaceholderText } = render(<Details tripId={tripId} />)

    // Mock API responses
    linksServer.create.mockResolvedValueOnce(mockLinksResponse[0])
    linksServer.getLinksByTripId.mockResolvedValueOnce(mockLinksResponse)

    // Abertura do modal para criar um link
    fireEvent.press(getByText('Cadastrar novo link'))

    // Preenche o título e URL válidos
    fireEvent.changeText(getByPlaceholderText('Título do link'), 'Novo Link')
    fireEvent.changeText(getByPlaceholderText('URL'), 'https://novo-link.com')

    // Clica no botão "Salvar link"
    fireEvent.press(getByText('Salvar link'))

    await waitFor(() => {
      // Verifica se a API foi chamada para criar o link
      expect(linksServer.create).toHaveBeenCalledWith({
        tripId,
        title: 'Novo Link',
        url: 'https://novo-link.com',
      })
      // Verifica se o link foi adicionado à lista
      expect(getByText('Novo Link')).toBeTruthy()
    })
  })

  test('should fetch and display participants correctly', async () => {
    const mockParticipants = [
      { id: '1', name: 'John Doe' },
      { id: '2', name: 'Jane Doe' }
    ]

    // Mock API response for participants
    participantsServer.getByTripId.mockResolvedValueOnce(mockParticipants)

    const { getByText } = render(<Details tripId={tripId} />)

    await waitFor(() => {
      // Verifica se os participantes são exibidos
      expect(getByText('John Doe')).toBeTruthy()
      expect(getByText('Jane Doe')).toBeTruthy()
    })
  })

  test('should show a message when there are no links', async () => {
    linksServer.getLinksByTripId.mockResolvedValueOnce([])

    const { getByText } = render(<Details tripId={tripId} />)

    await waitFor(() => {
      // Verifica se a mensagem de "Nenhum link adicionado" é exibida
      expect(getByText('Nenhum link adicionado.')).toBeTruthy()
    })
  })
})
