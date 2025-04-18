import '../../styles/Login.css';

export default function LoginCard() {
  return (
    <div className="login-card">
      <div className="left">
        <p className="login-message">지금, 당신의 아이디어를<br />마음껏 펼쳐보세요!</p>
        <div className="indicator">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot active"></span>
        </div>
      </div>
      <div className="right">
        <img src="/assets/images/common/logo.png" className="logo" alt="logo" />
        <h2>Trendist</h2>
        <button className="google-button">
          <img src="/assets/images/common/ic_google.png" alt="Google" />
          구글로 시작하기
        </button>
      </div>
    </div>
  );
}