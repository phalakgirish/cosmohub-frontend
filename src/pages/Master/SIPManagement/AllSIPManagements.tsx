import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Use useNavigate for navigation

// hooks
import { usePageTitle } from '../../../hooks';
import url from '../../../env';

// component
import Table from '../../../components/Table';
import secureLocalStorage from 'react-secure-storage';

// Define types
interface SIP {
    _id:string,
    sipmember_id:string,
    client_id:string,
    sipmember_name: string,
    sipmember_doj: Date,
    date_join:string,
    sipmember_maturity_date: Date,
    maturity_date:string
    sipmember_nominee_name: string,
    sipmember_nominee_age:number,
    sipmember_nominee_relation:string,
    sipmember_nominee_mobile:string
}

interface DataResponse {
    sip_member: SIP[];
}

const AllSIPManagement = () => {
    const [data, setData] = useState<SIP[]>([]);
    const navigate = useNavigate();
    const [isRefreshed,setIsRefreshed] = useState(false)

    // Define handleEdit function
    const handleEdit = (id: string) => {
        navigate(`/edit-sip/${id}`);
    };

    const handleDelete = async (id: string) => {
        const bearerToken = secureLocalStorage.getItem('login');
        fetch(`${url.nodeapipath}/sipmanagement/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*',
                'Authorization': `Bearer ${bearerToken}`
            }
        })
        .then((response) => response.json())
        .then((data) => {
            // console.log(data);
            // Optionally refresh data after deletion
            // setData(data.sip.map((sip: SIP) => ({
            //     ...sip,
            //     srNo: data.sip.indexOf(sip) + 1
            // })));
            setIsRefreshed(true)
        })
        .catch((error) => console.error('Error deleting SIP data:', error));
    };

    // Set page title
    usePageTitle({
        title: 'All Members',
        breadCrumbItems: [
            {
                path: '/sip-management',
                label: 'SIP Management',
                active: true,
            },
        ],
    });

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
    }

    useEffect(() => {
        const bearerToken = secureLocalStorage.getItem('login');
        fetch(`${url.nodeapipath}/sipmanagement/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*',
                'Authorization': `Bearer ${bearerToken}`
            }
        })
        .then((response) => response.json())
        .then((data: DataResponse) => {

            
            const formattedData = data.sip_member.map((sip, index) => ({
                srNo: index + 1,
                _id:sip._id,
                sipmember_id:sip.sipmember_id,
                client_id:sip.client_id,
                sipmember_name: sip.sipmember_name,
                sipmember_doj:sip.sipmember_doj,
                date_join: formatDate(new Date(sip.sipmember_doj)),
                sipmember_maturity_date:sip.sipmember_maturity_date,
                maturity_date: formatDate(new Date(sip.sipmember_maturity_date)),
                sipmember_nominee_name: sip.sipmember_nominee_name,
                sipmember_nominee_age:sip.sipmember_nominee_age,
                sipmember_nominee_relation:sip.sipmember_nominee_relation,
                sipmember_nominee_mobile:sip.sipmember_nominee_mobile
            }));

            setData(formattedData);
        })
        .catch((error) => console.error('Error fetching SIP data:', error));
    }, [isRefreshed]);

    const sizePerPageList = [
        { text: '5', value: 5 },
        { text: '10', value: 10 },
        { text: '25', value: 25 },
        { text: 'All', value: data.length },
    ];

    const handleAddSIP = () => {
        navigate('/add-sipmember');
    };

    const columns = [
        {
            Header: 'Sr. No',
            accessor: 'srNo',
            sort: true,
        },
        {
            Header: 'SIP Id',
            accessor: 'sipmember_id',
            sort: true,
        },
        {
            Header: 'Client Id',
            accessor: 'client_id',
            sort: true,
        },
        {
            Header: 'Member Name',
            accessor: 'sipmember_name',
            sort: true,
        },
        {
            Header: 'Date Of Joining',
            accessor: 'date_join',
            sort: true,
        },
        {
            Header: 'Maturity Date',
            accessor: 'maturity_date',
            sort: true,
        },
        {
            Header: 'Nominee Name',
            accessor: 'sipmember_nominee_name',
            sort: true,
        },
        {
            Header: 'Nominee Mobile No',
            accessor: 'sipmember_nominee_mobile',
            sort: true,
        },
        {
            Header: 'Actions',
            accessor: 'actions',
            Cell: ({ row }: { row: any }) => (
                <>
                    <Button
                        variant="primary"
                        onClick={() => handleEdit(row.original._id)}
                    >
                        Edit
                    </Button>&nbsp;
                    <Button
                        variant="danger"
                        onClick={() => handleDelete(row.original._id)}
                    >
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    return (
        <Row style={{marginTop:'25px'}}>
            <Col>
                <Card>
                    <Card.Body>
                        <div className="d-flex justify-content-between mb-4">
                            <div>
                                <h4 className="header-title">All Member</h4>
                                <p className="text-muted font-14 mb-4">A table showing all SIP Members</p>
                            </div>
                            <Button style={{ height: '40px', backgroundColor: '#dd4923' }} onClick={handleAddSIP}>
                                Add Member
                            </Button>
                        </div>

                        <Table
                            columns={columns}
                            data={data}
                            pageSize={5}
                            sizePerPageList={sizePerPageList}
                            isSortable={true}
                            pagination={true}
                            isSearchable={true}
                        />
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default AllSIPManagement;
