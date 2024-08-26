import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// hooks
import { usePageTitle } from '../../hooks';
import url from '../../env';

// component
import Table from '../../components/Table';
import secureLocalStorage from 'react-secure-storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define types
interface User {
    _id:string;
    user_emailId: string;
    user_role_type: string;
    staff_name: string;
    user_branch: string;
    user_status: string;
}

interface DataResponse {
    users: User[];
}

const UserManagement = () => {
    const [data, setData] = useState<any[]>([]);
    const StorageuserData:any = secureLocalStorage.getItem('userData');
    const userData:any = JSON.parse(StorageuserData);
    const [isRefreshed,setIsRefreshed] = useState('false');
    const navigate = useNavigate();

    const handleChangePassword = (id: string) => {
        navigate(`/change-password/${id}`);
    };

    usePageTitle({
        title: 'User Management',
        breadCrumbItems: [
            {
                path: '/user-management',
                label: 'User Management',
                active: true,
            },
        ],
    });

    const handleToggleStatus = async (e:any,id:any)=>{
        // console.log(e.target.value);

        // var userStatus = (e.target.value == 'on')?true:false
        const confirmed = window.confirm(`Are you sure you want to ${(e)?'Inactive':'Active'} this User?`);
        if (confirmed) {
            try
            {
                const bearerToken = secureLocalStorage.getItem('login');
                const response = await fetch(`${url.nodeapipath}/users/all/${id}`,{
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': `Bearer ${bearerToken}`,
                    },
                    body:JSON.stringify({user_status:!e})
                })
                const data = await response.json();
                if (response.ok)
                {
                    // console.log(data);
                    FetchUserData();
                    toast.success(`User ${(e)?'Inactiveted':'Activated'} successfully`);
                    setIsRefreshed('true')
                }
                else 
                {
                    console.error('Error fetching user details:', data);
                }
            }
            catch(error){
                console.error('Error during API call:', error);
            }
    }
    }

    useEffect(() => {
        FetchUserData();
    }, []);

    const FetchUserData = ()=>{
        try
        {
            const bearerToken = secureLocalStorage.getItem('login');
            fetch(`${url.nodeapipath}/users/${userData.staff_branch}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': `Bearer ${bearerToken}`,
                },
            })
                .then((response) => response.json())
                .then((data: DataResponse) => {
                    
                    const formattedData = data.users.map((user, index) => ({
                        srNo: index + 1,
                        ...user,
                    }));
                    setData(formattedData);
                })
                .catch((error) => console.error('Error fetching user data:', error));
        }
        catch(error)
        {
            console.error('Error during API call:', error);
        }
        
    }

    const sizePerPageList = [
        { text: '5', value: 5 },
        { text: '10', value: 10 },
        { text: '25', value: 25 },
        { text: 'All', value: data.length },
    ];

    const columns = [
        {
            Header: 'Sr. No',
            accessor: 'srNo',
            sort: true,
        },
        {
            Header: 'User Email ID',
            accessor: 'user_emailId',
            sort: true,
        },
        {
            Header: 'Staff Name',
            accessor: 'staff_name',
            sort: true,
        },
        {
            Header: 'Branch',
            accessor: 'user_branch',
            sort: true,
        },
        {
            Header: 'User Role',
            accessor: 'user_role_type',
            sort: true,
            Cell: ({ value }: { value:string }) => (value== '0' ? 'Super Admin' : (value == '1')?'Admin':'Staff'),
        },
        {
            Header: 'Status',
            accessor: 'user_status',
            Cell: ({ row }: { row: any }) => ( row.original.user_role_type == '0'?'':
                <Form.Check
                    type="switch"
                    id={`status-switch-${row.original._id}`}
                    checked={row.original.user_status}
                    onChange={(e) => handleToggleStatus(row.original.user_status,row.original._id)}
                />
            ),
            sort: true,
        },
        {
            Header: 'Actions',
            accessor: 'actions',
            Cell: ({ row }: { row: any }) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div
                        style={{
                            borderRadius: '25%',
                            backgroundColor: '#007bff',
                            width: '30px',
                            height: '30px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                        }}
                        onClick={() => handleChangePassword(row.original._id)}
                    >
                        <i className="mdi mdi-key" style={{ color: '#fff' }}></i>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <Row>
            <Col>
                <Card>
                    <Card.Body>
                        <div className="d-flex justify-content-between mb-4">
                            <div>
                                <h4 className="header-title">User Management</h4>
                                <p className="text-muted font-14 mb-4">A table showing all registered users</p>
                            </div>
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
            <ToastContainer />
        </Row>
    );
};

export default UserManagement;
