import { css } from 'lit'

export default css`
  :host {
    height: 64px;
  }

  wui-icon-link[data-hidden='true'] {
    opacity: 0 !important;
    pointer-events: none;
  }
`
