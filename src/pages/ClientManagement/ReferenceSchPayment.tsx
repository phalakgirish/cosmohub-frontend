import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '../../hooks';
import url from '../../env';
import Table from '../../components/Table';
import secureLocalStorage from 'react-secure-storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Payment {
    _id:string;
    refschpayment_receiptno: string;
    client_id: string;
    client_name: string;
    reference_scheme_amount: number;
    ref_payment_receivedBy: string;
    ref_payment_receivedDate: string;
}

interface DataResponse {
    refSchPayment: Payment[];
}

const AllPayments = () => {
    const [data, setData] = useState<Payment[]>([]);
    const navigate = useNavigate();
    const [paymentDeleted, setPaymentDeleted] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);

    const handleEdit = (id: string) => {
        navigate(`/edit-refschpayment/${id}`);
    };

    const handleShowModal = (id: string) => {
        setSelectedPaymentId(id);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPaymentId(null);
    };

    const handleConfirmDelete = async () => {
        if (selectedPaymentId) {
            // const confirmed = window.confirm("Are you sure you want to delete this SIP Payment?");
            // if (confirmed) {
                const bearerToken = secureLocalStorage.getItem('login');
                try {
                    const response = await fetch(`${url.nodeapipath}/referencesch/${selectedPaymentId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                            'Authorization': `Bearer ${bearerToken}`,
                        },
                    });
                    const result = await response.json();
                    if (response.ok) {
                        // console.log('Payment deleted successfully:', result);
                        toast.success('Payment deleted successfully');
                        setPaymentDeleted(prev => !prev);
                    } else {
                        // console.error('Error deleting payment:', result);
                        toast.error('Failed to delete Payment Receipt');

                    }
                } catch (error) {
                    // console.error('Error during API call:', error);
                    toast.error('An error occurred while deleting the Payment Receipt');
                }
                finally {
                    handleCloseModal();
                }
            // }
        }
    };

    usePageTitle({
        title: 'All Payments',
        breadCrumbItems: [
            {
                path: '/payments',
                label: 'Payments',
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
    const formatMonthDate = (dateString:any)=> {
        const [year, month] = dateString.split('-');
        
        // Create a date object using the year and month
        const date = new Date(`${year}-${month}-01`);
        
        // Format the month to get the full month name
        const options = { month: "long" };
        const monthName = new Intl.DateTimeFormat('en-US',{ month: 'long' }).format(date);
        
        return `${monthName}-${year}`;
    }

    useEffect(() => {
        const bearerToken = secureLocalStorage.getItem('login');
        const fetchPayments = async () => {
            try {
                const response = await fetch(`${url.nodeapipath}/referencesch/`, {
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
                    const formattedData = data.refSchPayment.map((payment, index) => ({
                        srNo: index + 1,
                        _id:payment._id,
                        refschpayment_receiptno:payment.refschpayment_receiptno,
                        client_id:payment.client_id,
                        client_name:payment.client_name,
                        reference_scheme_amount: payment.reference_scheme_amount,
                        ref_payment_receivedBy:payment.ref_payment_receivedBy,
                        ref_payment_receivedDate:formatDate(new Date(payment.ref_payment_receivedDate)),
                    }));
                    setData(formattedData);
                } else {
                    console.error('Error fetching payments:', data);
                }
            } catch (error) {
                console.error('Error during API call:', error);
            }
        };

        fetchPayments();
    }, [paymentDeleted]);

    const sizePerPageList = [
        { text: '5', value: 5 },
        { text: '10', value: 10 },
        { text: '25', value: 25 },
        { text: 'All', value: data.length },
    ];

    const handleAddPayment = () => {
        navigate('/add-refschpayment');
    };

    const columns = [
        {
            Header: 'Sr. No',
            accessor: 'srNo',
            sort: true,
        },
        {
            Header: 'Reciept No.',
            accessor: 'refschpayment_receiptno',
            sort: true,
        },
        {
            Header: 'Client Id',
            accessor: 'client_id',
            sort: true,
        },
        {
            Header: 'Client Name',
            accessor: 'client_name',
            sort: true,
        },
        {
            Header: 'Amount',
            accessor: 'reference_scheme_amount',
            sort: true,
        },
        {
            Header: 'Received By',
            accessor: 'ref_payment_receivedBy',
            sort: true,
        },
        {
            Header: 'Received Date',
            accessor: 'ref_payment_receivedDate',
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
                onClick={() => handleShowModal(row.original._id)}
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
                                <h4 className="header-title">All Payments</h4>
                                <p className="text-muted font-14 mb-4">A table showing all payment records</p>
                            </div>
                            <Button style={{ height: '40px', backgroundColor: '#dd4923' }} onClick={handleAddPayment}>
                                Add Payment
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
            <ToastContainer/>

            {/* Modal for Delete Confirmation */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this payment?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Row>
    );
};

export default AllPayments;
