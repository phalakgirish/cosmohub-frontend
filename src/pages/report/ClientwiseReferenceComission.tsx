import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, FormText, InputGroup, Tab, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '../../hooks';
import url from '../../env';
import Table from '../../components/Table';
import secureLocalStorage from 'react-secure-storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Controller, useForm } from 'react-hook-form';
import * as XLSX from 'xlsx';
import DeniReactTreeView from 'deni-react-treeview';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Link } from 'react-router-dom';
import OrganizationalChart from './OrganizationalChart';

interface Payment {
    generation:Number;
    client_id:string;
    client_name:string;
    months: Number;
    sipJoinDate: string;
    total_invested_amount: number;
    total_spot_commission: number;
    total_recurring_commission: number;
    referred_client_id: string;
    referred_client_name:string;
}
// Define the type for Client data
type Client = {
    _id: string;
    client_id: string;
    client_name: string;
    client_mobile_number: string;
};

type Option = string | Record<string, any>;

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
    CommissionDetails: Payment[];
    treeView:any;
}

const ClientwiseReferenceComission = () => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [data, setData] = useState<Payment[]>([]);
    const [commissionDts, setCommissionDts] = useState<any>([]);
    const [commissionTreeDts, setCommissionTreeDts] = useState<any>([]);


    const [simembers, setSipMembers] = useState<SipMember[]>([]);
    const navigate = useNavigate();
    const [paymentDeleted, setPaymentDeleted] = useState(false);
    const StorageuserData:any = secureLocalStorage.getItem('userData');
    const userData:any = JSON.parse(StorageuserData);
    const [month,setMonth] = useState('');
    const [clientsName, setClientsName] = useState('')
    const [sipMemberId, setSIPMemberId] = useState('')
    const [singleSelections, setSingleSelections] = useState<Option[]>([]);
    const [singleSIPSelections, setSingleSIPSelections] = useState<Option[]>([]);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [showPicker, setShowPicker] = useState<boolean>(false);

    const togglePicker = () => setShowPicker(!showPicker);

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setStartDate(e.target.value);
            setData([]);
        };
    
        const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setEndDate(e.target.value);
            // setShowPicker(false)
            setData([]);
        };
    
        const handleClear = () => {
            setStartDate('');
            setEndDate('');
            setShowPicker(false);
            setData([]);
        };

    usePageTitle({
        title: 'Clientwise Reference Comission Report',
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

    // const handleClientChange = (e:any)=>{
    //     handleFetchSIPMember(e.target.value);
    //     var clientname = clients.filter((item)=> item._id == e.target.value)
    //     setClientsName((clientname.length>0)?clientname[0].client_name:'');
    // }

    const handleClientChange = (e:any)=>{
        // console.log(e);
        setSingleSelections(e)
        if(e.length>0)
        {
            handleFetchSIPMember(e[0].value);
            var clientname = clients.filter((item)=> item._id == e[0].value)
            setClientsName(e[0].value);

        }
        else
        {
            setClientsName('');
            setData([]);

        }
        
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
            // console.log(data);
            
            
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
            if(clientsName == '')
            {
                toast.error('Client Id is required');
                return;
            }
                
            try {
                
                const bearerToken = secureLocalStorage.getItem('login');
                const dataToPost = {
                    client_id:clientsName,
                    startDate:startDate,
                    endDate:endDate
                }
                const response = await fetch(`${url.nodeapipath}/report/commission`, {
                    method: 'POST',
                    body:JSON.stringify(dataToPost),
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': `Bearer ${bearerToken}`,
                    },
                });
                const data: DataResponse = await response.json();
                console.log(data);
                
                
                if (response.ok) {
                    const formattedData = data.CommissionDetails.map((payment, index) => ({
                        srNo: index + 1,
                        generation:payment.generation,
                        client_id:payment.client_id,
                        client_name:payment.client_name,
                        sipJoinDate: formatDate(new Date(payment.sipJoinDate)),
                        months: payment.months,
                        total_invested_amount: payment.total_invested_amount,
                        total_spot_commission: payment.total_spot_commission,
                        total_recurring_commission:payment.total_recurring_commission,
                        referred_client_id: payment.referred_client_id,
                        referred_client_name: payment.referred_client_name,
                    }));
                    setData(formattedData);
                    setCommissionDts(data.CommissionDetails)
                    setCommissionTreeDts([data.treeView])
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

            var sipMembersfilesDetails = clients.filter((item:any)=>item._id == clientsName)
            exportToExcel(columns,Excelcolumns,data,`Clientwise Reference Commission Report-${sipMembersfilesDetails[0].client_id+'-'+sipMembersfilesDetails[0].client_name}.xlsx`)
        }

        const handleSIPMember = (e:any)=>{
            // console.log(e);
            
            setSingleSIPSelections(e)
            if(e.length>0)
            {
                setSIPMemberId(e[0].value);
        
            }
            else
            {
                setClientsName('');
                setSIPMemberId('');
                // setSipMembers([])
                setData([])
            }
            
            
        }

    const sizePerPageList = [
        { text: '5', value: 5 },
        { text: '10', value: 10 },
        { text: '25', value: 25 },
        { text: 'All', value: data.length },
    ];

    const Excelcolumns = ['Sr. No','Generation','Client Id','Client Name','Joined date','Months','Invested Amount','Spot Comission','Recurring Comission','Referred By Client Id','Referred By Client Name'];

    const columns = [
        {
            Header: 'Sr. No',
            accessor: 'srNo',
            sort: true,
        },
        {
            Header: 'Generation',
            accessor: 'generation',
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
            Header: 'Joined date',
            accessor: 'sipJoinDate',
            sort: true,
        },
        {
            Header: 'Months',
            accessor: 'months',
            sort: true,
        },
        {
            Header: 'Invested Amount',
            accessor: 'total_invested_amount',
            sort: true,
        },
        {
            Header: 'Spot Comission',
            accessor: 'total_spot_commission',
            sort: true,
        },
        {
            Header: 'Recurring Comission',
            accessor: 'total_recurring_commission',
            sort: true,
        },
        {
            Header: 'Referred By Client Id',
            accessor: 'referred_client_id',
            sort: true,
        },
        {
            Header: 'Referred By Client Name',
            accessor: 'referred_client_name',
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
                                <h4 className="header-title">Clientwise Reference Comission Report</h4>
                                <p className="text-muted font-14">A table showing cliest's commission report</p>
                            </div>
                        </div>
                        <hr />
                        <div className="mb-1">
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-2 d-flex">
                                                <Form.Label style={{width:'15%'}}>Client Id</Form.Label>
                                                <Typeahead
                                                id="select2"
                                                labelKey={'label'}
                                                multiple={false}
                                                onChange={(e)=>{handleClientChange(e)}}
                                                options={clients.map((client:any) => (
                                                    {value:`${client._id}`,label:`${client.client_id}-${client.client_name}`}
                                                ))}
                                                placeholder="select Client"
                                                selected={singleSelections}
                                                style={{width:'85%'}}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-2 d-flex">
                                            <Form.Label style={{width:'10%'}}>Date</Form.Label>
                                            <InputGroup style={{width:'90   %'}}>
                                                <Form.Control
                                                type="text"
                                                placeholder="Select date range"
                                                value={startDate && endDate ? `${startDate} to ${endDate}` : ''}
                                                readOnly
                                                onClick={togglePicker}
                                                
                                                />
                                                <Button variant="outline-secondary" onClick={handleClear}>
                                                Clear
                                                </Button>
                                            </InputGroup>

                                            {showPicker && (
                                                <div className="mt-2 border p-3" style={{position: 'absolute',
                                                    width: '42.3%',
                                                    right: '2   %',
                                                    top: '36%',background:'#fff'}}>
                                                <div className='d-flex'>
                                                    <Form.Group style={{width:'50%'}}>
                                                        <Form.Label>Start Date</Form.Label>
                                                        <Form.Control
                                                        type="date"
                                                        value={startDate}
                                                        onChange={handleStartDateChange}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group style={{width:'50%'}}>
                                                        <Form.Label>End Date</Form.Label>
                                                        <Form.Control
                                                        type="date"
                                                        value={endDate}
                                                        onChange={handleEndDateChange}
                                                        min={startDate} // Prevent selecting an end date before the start date
                                                        />
                                                    </Form.Group>
                                                </div>
                                                <Button
                                                    className="mt-3"
                                                    variant="primary"
                                                    onClick={() => setShowPicker(false)}
                                                >
                                                    Done
                                                </Button>
                                                </div>
                                            )}
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
                                <Tab.Container defaultActiveKey="List">
                                    <Nav as="ul" variant="tabs">
                                        <Nav.Item as="li" key={'list'}>
                                            <Nav.Link as={Link} to="#" eventKey={'List'} className="cursor-pointer">
                                                List
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item as="li" key={'tree'}>
                                            <Nav.Link as={Link} to="#" eventKey={'Tree'} className="cursor-pointer">
                                                Tree
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item as="li" key={'chart'}>
                                            <Nav.Link as={Link} to="#" eventKey={'Chart'} className="cursor-pointer">
                                                Chart
                                            </Nav.Link>
                                        </Nav.Item>
                                    </Nav>

                                    <Tab.Content>
                                        <Tab.Pane eventKey={'List'} id={String('list')} key={'list'}>
                                            <Table
                                                columns={columns}
                                                data={data}
                                                pageSize={5}
                                                sizePerPageList={sizePerPageList}
                                                isSortable={true}
                                                pagination={true}
                                                // isSearchable={true}
                                            />
                                        </Tab.Pane>
                                        <Tab.Pane eventKey={'Tree'} id={String('tree')} key={'tree'}>
                                            <div style={{padding:'3%',}}>
                                                <DeniReactTreeView items={commissionTreeDts} />
                                            </div>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey={'Chart'} id={String('chart')} key={'chart'}>
                                            {(commissionDts.length > 0)?
                                                <div style={{ width: '100%', height: 'auto' }}>
                                                    <OrganizationalChart data={commissionDts} />
                                                </div>:''
                                            }   
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Tab.Container>
                        
                    </Card.Body>
                </Card>
            </Col>
            <ToastContainer/>
        </Row>
    );
};

export default ClientwiseReferenceComission;
