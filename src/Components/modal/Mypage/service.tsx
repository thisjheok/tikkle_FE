import './Mypagemodal.css'

const Service = () => {
  return (
    <div className="service-modal-container" 
      onClick={() => window.open('https://tikkeul-service.notion.site/aeaefffa24cd48eca005c0fb71b9358c?pvs=4', '_blank')}
    >
      <img
        src="img/Mypage/서비스약관링크로.svg"
        style={{ width: '70px', cursor: 'pointer' }}
        alt="Share"
      />
      <div className="service-modal-text">서비스 약관</div>
    </div>
  )
}

export default Service
