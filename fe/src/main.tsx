import '@/shared/configs/i18n';
import 'antd/dist/reset.css';

import {createRoot} from 'react-dom/client';

import App from './entries/App';

const container = document.getElementById('root');
if (!container) {
    throw new Error('Root element not found');
}

const root = createRoot(container);

root.render(<App />);
