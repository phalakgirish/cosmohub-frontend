import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Use useNavigate for navigation

// hooks
import { usePageTitle } from '../../hooks';
import url from '../../env';

// component
import Table from '../../components/Table';
import secureLocalStorage from 'react-secure-storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    sipmember_nominee_mobile:string,
    sipmember_status:string,
}

interface DataResponse {
    sip_member: SIP[];
}

const AllSIPManagement = () => {
    const [data, setData] = useState<SIP[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showReplicaModal, setShowReplicaModal] = useState(false);
    const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
    const navigate = useNavigate();
    const [isRefreshed,setIsRefreshed] = useState(false)

    // Define handleEdit function
    const handleEdit = (id: string) => {
        navigate(`/edit-sipmember/${id}`);
    };

    const handleShowModal = (id: string) => {
        setSelectedMemberId(id);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedMemberId(null);
    };

    const handleShowReplicaModal = (id: string) => {
        setSelectedMemberId(id);
        setShowReplicaModal(true);
    };

    const handleCloseReplicaModal = () => {
        setShowReplicaModal(false);
        setSelectedMemberId(null);
    };

    const handleConfirmDelete = async () => {
        if (selectedMemberId) {
        const bearerToken = secureLocalStorage.getItem('login');
        try{
            fetch(`${url.nodeapipath}/sipmanagement/${selectedMemberId}`, {
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
                if (data.status) {
                    toast.success('SIP Member deleted successfully');
                    // setIsRefreshed(prev => !prev);
                    setIsRefreshed(prev => !prev)
                } else {
                    toast.error('Failed to delete SIP Member');
                }
            })
            .catch((error) => {
                // console.error('Error deleting SIP Member data:', error);
                toast.error('An error occurred while deleting the SIP Member');
            });
        }
        catch(error){
            toast.error('An error occurred while deleting the SIP Member');
        }
        finally {
            handleCloseModal();
        }
    }
    };

    const handleConfirmReplica = async () => {
        
        if (selectedMemberId) {
        const bearerToken = secureLocalStorage.getItem('login');
        console.log(bearerToken);
        
        try{
            fetch(`${url.nodeapipath}/sipmanagement/replicate/${selectedMemberId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin':'*',
                    'Authorization': `Bearer ${bearerToken}`
                }
            })
            .then((response) => response.json())
            .then((data) => {
                // console.log(data);
                if (data.status) {
                    toast.success(data.message ||'SIP Member Added successfully');
                    // setIsRefreshed(prev => !prev);
                    setIsRefreshed(prev => !prev)
                } else {
                    toast.error('Failed to add SIP Member');
                }
            })
            .catch((error) => {
                // console.error('Error deleting SIP Member data:', error);
                toast.error('An error occurred while adding the SIP Member');
            });
        }
        catch(error){
            toast.error('An error occurred while adding the SIP Member');
        }
        finally {
            handleCloseModal();
        }
    }
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
                sipmember_nominee_mobile:sip.sipmember_nominee_mobile,
                sipmember_status:sip.sipmember_status
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
            Header: 'Status',
            accessor: 'sipmember_status',
            sort: true,
        },
        {
            Header: 'Actions',
            accessor: 'actions',
            Cell: ({ row }: { row: any }) => (
                <>
                <OverlayTrigger
                            key={'edit-right'}
                            placement={'right'}
                            overlay={
                                <Tooltip id={`tooltip-${'right'}`}>
                                    Edit
                                </Tooltip>
                            }
                        >
                    <Button
                        variant="primary"
                        onClick={() => handleEdit(row.original._id)}
                        style={{borderRadius: '35px',
                            width: '38px',
                            padding: '7px 7px'}}
                    >
                        <i className='fe-edit-2'/>
                    </Button>
                </OverlayTrigger>
                &nbsp;
                <OverlayTrigger
                            key={'delete-right'}
                            placement={'right'}
                            overlay={
                                <Tooltip id={`tooltip-${'right'}`}>
                                    Delete
                                </Tooltip>
                            }
                        >
                    <Button
                    variant="danger"
                    onClick={() => handleShowModal(row.original._id)}
                    style={{borderRadius: '35px',
                        width: '38px',
                        padding: '7px 7px'}}
                    >
                    <i className='fe-trash-2'/> 
                </Button>
            </OverlayTrigger>
            &nbsp;
            <OverlayTrigger
                            key={'left'}
                            placement={'left'}
                            overlay={
                                <Tooltip id={`tooltip-${'left'}`}>
                                    Replicate Member Details
                                </Tooltip>
                            }
                        >
            <Button
                variant="warning"
                onClick={() => handleShowModal(row.original._id)}
                style={{borderRadius: '35px',
                    width: '38px',
                    padding: '7px 7px'}}
                >
                <i className='fe-copy'/> 
            </Button>
            </OverlayTrigger>
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
            <ToastContainer />

            {/* Modal for Delete Confirmation */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this SIP Member?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for Replica Creation Confirmation */}
            <Modal show={showReplicaModal} onHide={handleCloseReplicaModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to create replica of this SIP Member with new SIP ID?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseReplicaModal}>
                        Cancel
                    </Button>
                    <Button variant="warning" onClick={handleConfirmReplica}>
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>
        </Row>
    );
};

export default AllSIPManagement;
