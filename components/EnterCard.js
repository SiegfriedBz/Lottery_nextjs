import { ethers } from "ethers"

export default function EnterCard({
  lotteryState,
  lotteryFee,
  enterLottery,
  handleSucess,
  newWinnerInfo,
}) {
  let newWinner
  if (newWinnerInfo.winner) {
    newWinner = newWinnerInfo.winner
  }

  // winner: "",
  // winPrize: "",
  // winDate: "",

  return (
    <div className='card text-center mb-2 shadow-md'>
      <div className='card-header fs-4 text-white bg-dark'>Enter Lottery</div>
      <div className='card-body'>
        <p className='card-text'>
          Entrance fee: {ethers.utils.formatEther(lotteryFee)} ETH
        </p>
        <button
          onClick={async () => {
            await enterLottery({
              onSuccess: handleSucess,
              onError: (error) => {
                console.log(error)
              },
            })
          }}
          className='btn btn-dark'
        >
          Enter Lottery
        </button>
      </div>
      {newWinner && (
        <div className='card-footer text-muted'>newWinner: {newWinner}</div>
      )}

      <div className='card-footer text-muted'>Last Prize won xxx ago</div>
    </div>
  )
}
