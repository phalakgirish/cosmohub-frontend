import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, FormText } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '../../hooks';
import url from '../../env';
import Table from '../../components/Table';
import secureLocalStorage from 'react-secure-storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Controller, useForm } from 'react-hook-form';
import * as XLSX from 'xlsx';

interface Payment {
    sippayment_receiptno:string;
    Sip_id:string;
    sipmember_name:string;
    sip_payment_month: string;
    sip_amount: number;
    sip_penalty_month: string;
    sip_penalty_amount: number;
    sip_payment_mode: string;
    sip_payment_refno: string;
    sip_payment_receivedBy:string;
    sip_payment_receivedDate:string;
}
// Define the type for Client data
type Client = {
    _id: string;
    client_id: string;
    client_name: string
};

// Define the type for branch data
type Branch = {
    _id: string;
    branch_name: string;
};

// Define the type for Client data
type SipMember = {
    _id: string;
    sipmember_id: string;
    sipmember_name: string
};

interface DataResponse {
    sipPayment: Payment[];
}

const SIPMemberPaymentReport = () => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [data, setData] = useState<Payment[]>([]);
    const [simembers, setSipMembers] = useState<SipMember[]>([]);
    const navigate = useNavigate();
    const [paymentDeleted, setPaymentDeleted] = useState(false);
    const StorageuserData:any = secureLocalStorage.getItem('userData');
    const userData:any = JSON.parse(StorageuserData);
    const [month,setMonth] = useState('');
    const [clientsName, setClientsName] = useState('')
    const [sipMemberId, setSIPMemberId] = useState('')


    usePageTitle({
        title: 'SIP Member Payment Report',
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
        if(dateString == '')
            return '';
        const [year, month] = dateString.split('-');
        
        // Create a date object using the year and month
        const date = new Date(`${year}-${month}-01`);
        
        // Format the month to get the full month name
        const options = { month: "long" };
        const monthName = new Intl.DateTimeFormat('en-US',{ month: 'long' }).format(date);
        
        return `${monthName}-${year}`;
    }

    // useEffect(() => {
    //     fetchPayments();
    // }, []);

    useEffect(()=>{
        const bearerToken = secureLocalStorage.getItem('login');
        const fetchBranches = async () => {
            try {
                const response = await fetch(`${url.nodeapipath}/branch/all/all`,{
                    method:'GET',
                    headers: {
                        'Content-Type':'application/json',
                        'Access-Control-Allow-Origin':'*',
                        'Authorization': `Bearer ${bearerToken}`
                        }
                });
                const data = await response.json();
                // console.log(data);   
                
                if (response.ok) {
                    setBranches(data.branch || []);
                } else {
                    console.error('Error fetching branches:', data);
                }
            } catch (error) {
                console.error('Error during API call:', error);
            }
        };
        fetchBranches();

        const fetchClients = async () => {
            try {
                
                const response = await fetch(`${url.nodeapipath}/all/client/${userData.staff_branch}`,{
                    method:'GET',
                    headers: {
                        'Content-Type':'application/json',
                        'Access-Control-Allow-Origin':'*',
                        'Authorization': `Bearer ${bearerToken}`
                        }
                });
                const data = await response.json();

                
                if (response.ok) {
                    setClients(data.client || []);

                } else {
                    console.error('Error fetching branches:', data);
                }
            } catch (error) {
                console.error('Error during API call:', error);
            }
        };

        fetchClients();   
    },[])

    const handleClientChange = (e:any)=>{
        handleFetchSIPMember(e.target.value);
        var clientname = clients.filter((item)=> item._id == e.target.value)
        setClientsName((clientname.length>0)?clientname[0].client_name:'');
    }

    const handleFetchSIPMember = async(id:any)=>{
        try {
            const bearerToken = secureLocalStorage.getItem('login');
            const response = await fetch(`${url.nodeapipath}/all/sipmembers-report/${id}`,{
                method:'GET',
                headers: {
                    'Content-Type':'application/json',
                    'Access-Control-Allow-Origin':'*',
                    'Authorization': `Bearer ${bearerToken}`
                    }
            });
            const data = await response.json();

            
            if (response.ok) {
                setSipMembers(data.sipmember || []);

            } else {
                console.error('Error fetching branches:', data);
            }
        } catch (error) {
            console.error('Error during API call:', error);
        }
    }


    
        const fetchPayments = async () => {
            try {
                const bearerToken = secureLocalStorage.getItem('login');
                const response = await fetch(`${url.nodeapipath}/report/member-payment?sip_id=${sipMemberId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': `Bearer ${bearerToken}`,
                    },
                });
                const data: DataResponse = await response.json();
                
                
                if (response.ok) {
                    const formattedData = data.sipPayment.map((payment, index) => ({
                        srNo: index + 1,
                        sippayment_receiptno:payment.sippayment_receiptno,
                        Sip_id:payment.Sip_id,
                        sipmember_name:payment.sipmember_name,
                        sip_amount: payment.sip_amount,
                        sip_payment_month: formatMonthDate(payment.sip_payment_month),
                        sip_penalty_amount: payment.sip_penalty_amount,
                        sip_penalty_month: formatMonthDate(payment.sip_penalty_month),
                        sip_payment_mode: payment.sip_payment_mode,
                        sip_payment_refno: payment.sip_payment_refno,
                        sip_payment_receivedBy:payment.sip_payment_receivedBy,
                        sip_payment_receivedDate:formatDate(new Date(payment.sip_payment_receivedDate)),
                    }));
                    setData(formattedData);
                } else {
                    console.error('Error fetching payments:', data);
                }
            } catch (error) {
                console.error('Error during API call:', error);
            }
        };

        const handleSearchPayment = ()=>{
            fetchPayments();
        }
        const handleExportPayment = ()=>{
            if(data.length == 0)
                return;

            var sipMembersfilesDetails = simembers.filter((item:any)=>item._id == sipMemberId)
            exportToExcel(columns,Excelcolumns,data,`SIP Member Payment Report-${sipMembersfilesDetails[0].sipmember_id+'-'+sipMembersfilesDetails[0].sipmember_name}.xlsx`)
        }

        const handleSIPMember = (e:any)=>{
            setSIPMemberId(e.target.value);
        }

    const sizePerPageList = [
        { text: '5', value: 5 },
        { text: '10', value: 10 },
        { text: '25', value: 25 },
        { text: 'All', value: data.length },
    ];

    const Excelcolumns = ['Sr. No','Reciept No.','SIP Id','Member Name','Amount','Month','Penalty Amount','Penalty Recovery Month','Payment Mode','Received By','Received Date'];

    const columns = [
        {
            Header: 'Sr. No',
            accessor: 'srNo',
            sort: true,
        },
        {
            Header: 'Reciept No.',
            accessor: 'sippayment_receiptno',
            sort: true,
        },
        {
            Header: 'SIP Id',
            accessor: 'Sip_id',
            sort: true,
        },
        {
            Header: 'Member Name',
            accessor: 'sipmember_name',
            sort: true,
        },
        {
            Header: 'Amount',
            accessor: 'sip_amount',
            sort: true,
        },
        {
            Header: 'Month',
            accessor: 'sip_payment_month',
            sort: true,
        },
        {
            Header: 'Penalty Amount',
            accessor: 'sip_penalty_amount',
            sort: true,
        },
        {
            Header: 'Penalty Recovery Month',
            accessor: 'sip_penalty_month',
            sort: true,
        },
        {
            Header: 'Payment Mode',
            accessor: 'sip_payment_mode',
            sort: true,
        },
        {
            Header: 'Received By',
            accessor: 'sip_payment_receivedBy',
            sort: true,
        },
        {
            Header: 'Received Date',
            accessor: 'sip_payment_receivedDate',
            sort: true,
        },
    ];


    const exportToExcel = (columns:any,columnHeader:any, data:any, fileName:any) => {
        // console.log(data);
        
        // Create a new workbook
        const workbook = XLSX.utils.book_new();
    
        // Map the data to an array of objects with the specified column names
        const worksheetData = data.map((item:any) =>
            columns.reduce((acc:any, column:any) => {
                acc[column.Header] = item[column.accessor];
                return acc;
            }, {})
        );
    
        // Convert the data to a worksheet
        const worksheet = XLSX.utils.json_to_sheet(worksheetData, { header: columnHeader });
    
        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
        // Generate Excel file and download it
        XLSX.writeFile(workbook, fileName);
    };

    return (
        <Row style={{ marginTop: '25px' }}>
            <Col>
                <Card>
                    <Card.Body>
                        <div className="d-flex justify-content-between">
                            <div>
                                <h4 className="header-title">SIP Member Payment Report</h4>
                                <p className="text-muted font-14">A table showing SIP member payment report</p>
                            </div>
                        </div>
                        <hr />
                        <div className="mb-1">
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-2 d-flex">
                                                <Form.Label style={{width:'15%'}}>Client Id</Form.Label>
                                                <select
                                                className='form-control'
                                                onChange={(e)=>{handleClientChange(e)}}
                                                >
                                                    <option>Select Client</option>
                                                    {clients.map((member) => (
                                                        <option key={member._id} value={member._id}>
                                                            {`${member.client_id}, ${member.client_name}`}
                                                        </option>
                                                        ))}
                                                </select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                    <Form.Group className="mb-2 d-flex">
                                        <Form.Label style={{width:'25%'}}>SIP Member Id</Form.Label>
                                        <select className='form-control'
                                        onChange={(e)=>{handleSIPMember(e)}}
                                        >
                                            <option>Select SIP Member</option>
                                            {simembers.map((member) => (
                                                <option key={member._id} value={member._id}>
                                                    {`${member.sipmember_id}, ${member.sipmember_name}`}
                                                </option>
                                                ))}
                                        </select>
                                    </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                    </Col>
                                    <Col md={6} style={{ textAlign:'end' }}>
                                        <Button style={{ height: '40px', backgroundColor: '#dd4923'}} onClick={handleSearchPayment}>
                                                Search
                                        </Button>
                                        &nbsp;
                                        <Button style={{ height: '40px', backgroundColor: '#05711e'}} onClick={handleExportPayment}>
                                                Export
                                        </Button>
                                    </Col>
                                </Row>
                        </div>
                        <hr />
                        <Table
                            columns={columns}
                            data={data}
                            pageSize={5}
                            sizePerPageList={sizePerPageList}
                            isSortable={true}
                            pagination={true}
                            // isSearchable={true}
                        />
                    </Card.Body>
                </Card>
            </Col>
            <ToastContainer/>
        </Row>
    );
};

export default SIPMemberPaymentReport;
