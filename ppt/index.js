import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleProvider } from 'antd';
import './index.css';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import * as serviceWorker from './serviceWorker';
import PageLayout from './components/PageLayout'

moment.locale('zh-cn');

class App extends React.Component {
    render() {
        return (
            <LocaleProvider locale={zhCN}>
                <PageLayout />
            </LocaleProvider>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
