export default function PlayersCard({ players, newPlayer }) {
  return (
    <div className='card text-center mb-2 shadow-md'>
      <div className='card-header fs-4 text-white bg-dark'>Players</div>
      <div className='card-body'>
        <h5 className='card-title'>Number of Players</h5>
        <h5 className='card-title'>{players.length}</h5>
      </div>
      {newPlayer && (
        <div className='card-footer text-muted'>
          New Player joined: {newPlayer.slice(0, 4)}...
          {newPlayer.slice(38, 42)}
        </div>
      )}
    </div>
  )
}
