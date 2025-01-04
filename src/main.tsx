import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import store from './store/store'
import * as Sentry from "@sentry/react";
import { browserTracingIntegration } from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  release: 'release version', 
  integrations: [browserTracingIntegration()],
  tracesSampleRate: 1.0, // 프로덕션에서는 낮은 값 사용 권장 (예: 0.2)
  environment: 'production',//애플리케이션 환경 (dev, production 등)
  normalizeDepth: 6, //컨텍스트 데이터를 주어진 깊이로 정규화

});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>
)
