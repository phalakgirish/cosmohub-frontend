import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Button } from 'react-bootstrap';

// hooks
import { usePageTitle } from '../../hooks';
import url from '../../env';

// component
import Table from '../../components/Table';
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';

// Define types
interface Designation {
    _id: string;
    designation_name: string;
    department_name:string
    designation_status: boolean;
}

interface DataResponse {
    designation: Designation[];
}


const Designation = () => {
    const [data, setData] = useState<any[]>([]);
    const navigate = useNavigate(); 

    const handleEdit = (id: string) => {
        navigate(`/edit-designation/${id}`);
    };

    const handleDelete = async (id:string) =>{
        const bearerToken = secureLocalStorage.getItem('login');
        fetch(`${url.nodeapipath}/designation/${id}`,{
            method:'DELETE',
            headers: {
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin':'*',
                'Authorization': `Bearer ${bearerToken}`
                }
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            })
            .catch((error) => console.error('Error fetching branch data:', error));
    }

    usePageTitle({
        title: 'Designations',
        breadCrumbItems: [
            {
                path: '/designation',
                label: 'Designations',
                active: true,
            },
        ],
    });

    useEffect(() => {
        const bearerToken = secureLocalStorage.getItem('login');
        fetch(`${url.nodeapipath}/designation/`,{
            method:'GET',
            headers: {
                'Content-Type':'application/json',
                'Access-Control-Allow-Origin':'*',
                'Authorization': `Bearer ${bearerToken}`
                }
        })
            .then((response) => response.json())
            .then((data: DataResponse) => {
                console.log(data);
                const formattedData = data.designation.map((designation: any, index: number) => ({
                    srNo: index + 1,
                    ...designation,
                }));
                setData(formattedData);
            })
            .catch((error) => console.error('Error fetching designation data:', error));
    }, []);

    const sizePerPageList = [
        {
            text: '5',
            value: 5,
        },
        {
            text: '10',
            value: 10,
        },
        {
            text: '25',
            value: 25,
        },
        {
            text: 'All',
            value: data.length,
        },
    ];

    const handleAddDesignation = () => {
        window.location.href = '/add-designation';
    };

    
const columns = [
    {
        Header: 'Sr. No',
        accessor: 'srNo',
        sort: true,
    },
    {
        Header: 'Designation Name',
        accessor: 'designation_name',
        sort: true,
    },
    {
        Header: 'Department Name',
        accessor: 'department_name',
        sort: true,
    },
    {
        Header: 'Status',
        accessor: 'designation_status',
        sort: true,
        Cell: ({ value }: { value: boolean }) => (value ? 'Active' : 'Inactive'),
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
                </Button>
                &nbsp;
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
        <Row>
            <Col>
                <Card>
                    <Card.Body>
                        <div className="d-flex justify-content-between mb-4">
                            <div>
                                <h4 className="header-title">Designations</h4>
                                <p className="text-muted font-14 mb-4">A table showing all designations</p>
                            </div>
                            <Button style={{height:'40px', backgroundColor:'#dd4923'}} onClick={handleAddDesignation}>
                                Add Designation
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

export default Designation;
