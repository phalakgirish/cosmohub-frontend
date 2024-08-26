import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '../../hooks';
import url from '../../env';
import Table from '../../components/Table';
import secureLocalStorage from 'react-secure-storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Maturity {
    _id: string;
    sipmaturity_receiptno: string;
    Sip_id: string;
    sipmember_name: string;
    sip_maturity_amount: number;
    sip_payment_paidBy: string;
    sip_payment_paidDate: string;
}

interface DataResponse {
    sipMPayment: Maturity[];
}

const AllMaturities = () => {
    const [data, setData] = useState<Maturity[]>([]);
    const navigate = useNavigate();
    const [maturityDeleted, setMaturityDeleted] = useState(false);

    const handleEdit = (id: string) => {
        navigate(`/edit-maturity/${id}`);
    };

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this SIP Maturity?");
        if (confirmed) {
            const bearerToken = secureLocalStorage.getItem('login');
            try {
                const response = await fetch(`${url.nodeapipath}/sipmaturity/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': `Bearer ${bearerToken}`,
                    },
                });
                const result = await response.json();

                if (response.ok) {
                    toast.success(result.message ||'Maturity deleted successfully');
                    // console.log('Maturity deleted successfully:', result);
                    setMaturityDeleted(true);
                } else {
                    toast.error(result.message || 'Failed to delete maturity');
                }
            } catch (error) {
                // console.error('Error during API call:', error);
                toast.error('An error occurred while deleting the maturity');
                
            }
        }
    };

    usePageTitle({
        title: 'All Maturities',
        breadCrumbItems: [
            {
                path: '/maturities',
                label: 'Maturities',
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
        const fetchMaturities = async () => {
            try {
                const response = await fetch(`${url.nodeapipath}/sipmaturity/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': `Bearer ${bearerToken}`,
                    },
                });
                const data: DataResponse = await response.json();
                // console.log(data);
                
                if (response.ok) {
                    const formattedData = data.sipMPayment.map((maturity, index) => ({
                        srNo: index + 1,
                        sipmaturity_receiptno:maturity.sipmaturity_receiptno,
                        _id: maturity._id,
                        Sip_id: maturity.Sip_id,
                        sipmember_name: maturity.sipmember_name,
                        sip_maturity_amount: maturity.sip_maturity_amount,
                        sip_payment_paidBy: maturity.sip_payment_paidBy,
                        sip_payment_paidDate: formatDate(new Date(maturity.sip_payment_paidDate)),
                    }));
                    setData(formattedData);
                } else {
                    console.error('Error fetching maturities:', data);
                }
            } catch (error) {
                console.error('Error during API call:', error);
            }
        };

        fetchMaturities();
    }, [maturityDeleted]);

    const sizePerPageList = [
        { text: '5', value: 5 },
        { text: '10', value: 10 },
        { text: '25', value: 25 },
        { text: 'All', value: data.length },
    ];

    const handleAddMaturity = () => {
        navigate('/add-maturity');
    };

    const columns = [
        {
            Header: 'Sr. No',
            accessor: 'srNo',
            sort: true,
        },
        {
            Header: 'Recipet No.',
            accessor: 'sipmaturity_receiptno',
            sort: true,
        },
        {
            Header: 'SIP Member Code',
            accessor: 'Sip_id',
            sort: true,
        },
        {
            Header: 'Name',
            accessor: 'sipmember_name',
            sort: true,
        },
        {
            Header: 'Paid Amount',
            accessor: 'sip_maturity_amount',
            sort: true,
        },
        {
            Header: 'Paid By',
            accessor: 'sip_payment_paidBy',
            sort: true,
        },
        {
            Header: 'Paid Date',
            accessor: 'sip_payment_paidDate',
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
                    style={{borderRadius: '35px',
                        width: '38px',
                        padding: '7px 7px'}}
                >
                     <i className='fe-edit-2'/>
                </Button>
                &nbsp;
                <Button
                variant="danger"
                onClick={() => handleDelete(row.original._id)}
                style={{borderRadius: '35px',
                    width: '38px',
                    padding: '7px 7px'}}
                >
                <i className='fe-trash-2'/> 
            </Button>
        </>
            ),
        },
    ];

    return (
        <Row style={{ marginTop: '25px' }}>
            <Col>
                <Card>
                    <Card.Body>
                        <div className="d-flex justify-content-between mb-4">
                            <div>
                                <h4 className="header-title">All Maturities</h4>
                                <p className="text-muted font-14 mb-4">A table showing all maturity records</p>
                            </div>
                            <Button style={{ height: '40px', backgroundColor: '#dd4923' }} onClick={handleAddMaturity}>
                                Add Maturity
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
            <ToastContainer />
        </Row>
    );
};

export default AllMaturities;
