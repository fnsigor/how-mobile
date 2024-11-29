import { ReactElement } from 'react'
import { render } from '@testing-library/react-native'
// import {ThemeProvider} from 'my-ui-lib'


const AllTheProviders = ({ children }: { children: ReactElement }) => {
  return (
    // <ThemeProvider theme="light">
    // {children}
    // </ThemeProvider>
    { children }
  )
}

const customRender = (ui: ReactElement, options?: any) =>
  render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react-native'

export { customRender as render }