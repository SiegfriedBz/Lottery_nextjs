import { ConnectButton } from "web3uikit"

export default function Header() {
  return (
    <>
      <nav className='navbar navbar-dark bg-dark rounded-1 mb-2'>
        <div className='container-fluid'>
          <a className='navbar-brand'>
            <h1>Lottery</h1>
          </a>
          <div className='d-flex'>
            <ConnectButton moralisAuth={false} />
          </div>
        </div>
      </nav>
    </>
  )
}
