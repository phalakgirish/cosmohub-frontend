import { Col, Row } from 'react-bootstrap';

// hooks
import { usePageTitle } from '../../../hooks';

// component
import Statistics from './Statistics';
import SalesChart from './SalesChart';
import StatisticsChart from './StatisticsChart';
import RevenueChart from './RevenueChart';
import Users from './Users';
import Inbox from './Inbox';
import Projects from './Projects';

// dummy data
import { messages, projectDetails } from './data';
import secureLocalStorage from 'react-secure-storage';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DashBoard1 = () => {
    // set pagetitle
    const navigate = useNavigate();

    useEffect(()=>{
        const loginvalue = secureLocalStorage.getItem('login');
    const StorageuserData:any = secureLocalStorage.getItem('userData');

    if(loginvalue == null || loginvalue == undefined)
    {
        navigate('/auth/login');
    }
    else if(StorageuserData == null || StorageuserData == undefined)
    {
        navigate('/auth/login');
    }
    },[])
    

    usePageTitle({
        title: 'DashBoard',
        breadCrumbItems: [
            {
                path: '/dashboard',
                label: 'DashBoard',
                active: true,
            },
        ],
    });

    return (
        <>
        <h1 style={{ color: 'white' }}>Dashboard</h1>

            <Statistics />

            <Row>
                {/*<Col xl={4}>
                    <SalesChart />
                </Col>
                 <Col xl={4}>
                    <StatisticsChart />
                </Col>
                <Col xl={4}>
                    <RevenueChart />
                </Col> */}
                <ToastContainer />
            </Row>

            {/* <Users />

            <Row>
                <Col xl={4}>
                    <Inbox messages={messages} />
                </Col>
                <Col xl={8}>
                    <Projects projectDetails={projectDetails} />
                </Col>
            </Row> */}
        </>
    );
};

export default DashBoard1;
