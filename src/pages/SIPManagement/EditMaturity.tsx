import { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import url from '../../env';
import { usePageTitle } from '../../hooks';
import secureLocalStorage from 'react-secure-storage';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

type MaturityData = {
    sipmaturity_receiptno: string;
    client_id: string;
    sipmember_id: string;
    sip_maturity_amount: number;
    sip_payment_mode: string;
    sip_payment_paidBy: string;
    sip_payment_paidDate: string;
    sip_maturity_doc: File;
};

// Define the type for branch data
type Branch = {
    _id: string;
    branch_name: string;
};

// Define the type for Client data
type Client = {
    _id: string;
    client_id: string;
    client_name: string
};

// Define the type for Client data
type SipMember = {
    _id: string;
    sipmember_id: string;
    sipmember_name: string
};

type Staff = {
    _id: string;
    staff_id: string;
    staff_name: string
};

const schema = yup.object().shape({
    client_id: yup.string().required('Client ID is required'),
    sipmember_id: yup.string().required('SIP Member Id is required'),
    sip_maturity_amount: yup.number().required('Paid Amount is required').positive('Amount must be positive'),
    sip_payment_mode: yup.string().required('Payment Mode is required'),
});

const EditMaturityForm = () => {
    const { id } = useParams<{ id: string }>();
    const [branches, setBranches] = useState<Branch[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [simembers, setSipMembers] = useState<SipMember[]>([]);
    const [staff, setStaff] = useState<Staff[]>([]);
    const StorageuserData:any = secureLocalStorage.getItem('userData');
    const userData:any = JSON.parse(StorageuserData);
    const [clientbranch, setClientBranch] = useState('');
    const [branchErr,setBranchErr] = useState(false);
    const [clientsName, setClientsName] = useState('')
    const navigate = useNavigate()
    const [paidDate, setPaidDate] = useState('')

    var today = new Date();
    var TodayDate = today.toISOString().split('T')[0];

    const { control, handleSubmit, reset,formState:{errors},setValue } = useForm<MaturityData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: MaturityData) => {
        // console.log('Form data:', data);

        if(userData.staff_branch == '0' && clientbranch == '')
        {
            setBranchErr(true);
        }
        else
        {
            const formData = new FormData();
            formData.append('sipmaturity_receiptno', data.sipmaturity_receiptno);
            formData.append('client_id', data.client_id);
            formData.append('sipmember_id', data.sipmember_id);
            formData.append('sipmember_name', clientsName);
            formData.append('sip_maturity_amount',data.sip_maturity_amount.toString());
            formData.append('sip_payment_mode',data.sip_payment_mode);
            formData.append('sip_payment_paidBy',data.sip_payment_paidBy);
            formData.append('sip_payment_paidDate',data.sip_payment_paidDate);
            formData.append('sip_maturity_doc', data.sip_maturity_doc instanceof File ? data.sip_maturity_doc:'');
            formData.append('branch_id', (userData.staff_branch =='0')?clientbranch:userData.staff_branch);

            try {
                const bearerToken = secureLocalStorage.getItem('login');
                const response = await fetch(`${url.nodeapipath}/sipmaturity/${id}`, {
                    body: formData,
                    method: 'PUT',
                    headers: {
                        'Access-Control-Allow-Origin':'*',
                        'Authorization': `Bearer ${bearerToken}`
                    },
                });
                const result = await response.json();
                // console.log('Registration successful:', result);
                if (response.ok) {
                    // console.log('Maturity updated successfully:', result);
                    toast.success(result.message || 'Maturity updated successfully');
                    navigate('/all-maturity');
                } else {
                    // console.error('Error updating maturity:', result);
                    toast.error(result.message || 'Failed to update maturity');
                    navigate('/all-maturity');
                }
                
            } catch (error) {
                // console.error('Error during registration:', error);
                toast.error('An error occurred. Please try again.');
            }
        }

    };

    const handleClientChange = (e:any)=>{
        handleFetchSIPMember(e.target.value);
        var clientname = clients.filter((item)=> item._id == e.target.value)
        setClientsName((clientname.length>0)?clientname[0].client_name:'');
    }

    const handleFetchSIPMember = async(id:any)=>{
        try {
            const bearerToken = secureLocalStorage.getItem('login');
            const response = await fetch(`${url.nodeapipath}/all/sipmembers/${id}`,{
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
        // fetchBranches();

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

        // fetchClients();

        const fetchStaff = async () => {
            try {

                const response = await fetch(`${url.nodeapipath}/all/staff/${userData.staff_branch}`,{
                    method:'GET',
                    headers: {
                        'Content-Type':'application/json',
                        'Access-Control-Allow-Origin':'*',
                        'Authorization': `Bearer ${bearerToken}`
                        }
                });
                const data = await response.json();
                if (response.ok) {
                    setStaff(data.staff || []);

                } else {
                    console.error('Error fetching branches:', data);
                }
            } catch (error) {
                console.error('Error during API call:', error);
            }
        };

        // fetchStaff();

        const fetchMaturityDetails = async () => {
            try {

                const response = await fetch(`${url.nodeapipath}/sipmaturity/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': `Bearer ${bearerToken}`,
                    },
                });
                const data = await response.json();
                // console.log(data);
                
                if (response.ok && data.sipMPayment.length > 0) {
                    const sipMPaymentDetails = data.sipMPayment[0];
                    await fetchClients();
                    await fetchBranches();
                    await fetchStaff();
                    setValue('sipmaturity_receiptno',sipMPaymentDetails.sipmaturity_receiptno)
                    setValue('client_id', sipMPaymentDetails.client_id);
                    await handleClientChange({target:{value:sipMPaymentDetails.client_id}})
                    setValue('sipmember_id', sipMPaymentDetails.sipmember_id);
                    setValue('sip_maturity_amount', sipMPaymentDetails.sip_maturity_amount);
                    setValue('sip_payment_mode', sipMPaymentDetails.sip_payment_mode);
                    setValue('sip_payment_paidBy', sipMPaymentDetails.sip_payment_paidBy);
                    setValue('sip_payment_paidDate', sipMPaymentDetails.sip_payment_paidDate.split('T')[0]);
                    // setPaidDate(sipMPaymentDetails.sip_payment_receivedDate.split('T')[0])
                    setClientBranch(sipMPaymentDetails.branch_id)
                    setClientsName(sipMPaymentDetails.sipmember_name)
                } else {
                    console.error('Error fetching staff details:', data);
                }
            } catch (error) {
                console.error('Error during API call:', error);
            }
        };
        fetchMaturityDetails()
    },[])

    const fetchSIPTotalAmount = async(id:any)=>{
        try {
            const bearerToken = secureLocalStorage.getItem('login');
            const response = await fetch(`${url.nodeapipath}/sipmaturity/amount/${id}`,{
                method:'GET',
                headers: {
                    'Content-Type':'application/json',
                    'Access-Control-Allow-Origin':'*',
                    'Authorization': `Bearer ${bearerToken}`
                    }
            });
            const data = await response.json();
            console.log(data);
            
            if (response.ok) {
                // setStaff(data.staff || []);
                console.log(data.sipMAmount);
                
                setValue('sip_maturity_amount',data.sipMAmount)

            } else {
                console.error('Error fetching branches:', data);
            }
        } catch (error) {
            console.error('Error during API call:', error);
        }
    }

    const handleBranchChange = (e:any)=>{
        setClientBranch(e.target.value)
        if(e.target.value == '')
        {
            setBranchErr(true)
        }
        else
        {
            setBranchErr(false)
        }  
    }

    return (
        <Card>
            <Card.Body>
                <div className='d-flex'>
                    <div>
                        <h4 className="header-title mt-0 mb-1">Edit Maturity Details</h4>
                        <p className="sub-header">Fill in the details for maturity processing.</p>
                    </div>
                    <div className="text-md-end mb-0" style={{width:'78.6%'}}>
                        <Button variant="dark" type="reset" onClick={()=>{navigate('/all-maturity')}}>
                            Back
                        </Button>
                    </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label> Maturity Reciept No.</Form.Label>
                                <Controller
                                    name="sipmaturity_receiptno"
                                    control={control}
                                    render={({ field }) => <Form.Control {...field} placeholder="Enter Payment Ref. No." disabled={true}/>}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Client ID</Form.Label>
                                {/* <Controller
                                    name="client_id"
                                    control={control}
                                    render={({ field }) => <Form.Control {...field} placeholder="Enter Customer ID" />}
                                /> */}
                                <Controller
                                    name="client_id"
                                    control={control}
                                    render={({ field }) => (<Form.Select
                                    {...field}
                                    isInvalid={!!errors.client_id}
                                    onChange={(e)=>{field.onChange(e.target.value); handleClientChange(e)}}
                                    >
                                        <option>Select SIP Member</option>
                                        {clients.map((member) => (
                                             <option key={member._id} value={member._id}>
                                                 {`${member.client_id}, ${member.client_name}`}
                                             </option>
                                             ))}
                                    </Form.Select>
                                    )}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.client_id?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>   
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>SIP Member Id</Form.Label>

                                <Controller
                                    name="sipmember_id"
                                    control={control}
                                    render={({ field }) => (<Form.Select
                                    {...field}
                                    isInvalid={!!errors.sipmember_id}
                                    onChange={(e)=>{field.onChange(e.target.value); fetchSIPTotalAmount(e.target.value)}}
                                    >
                                        <option>Select SIP Member</option>
                                        {simembers.map((member) => (
                                             <option key={member._id} value={member._id}>
                                                 {`${member.sipmember_id}, ${member.sipmember_name}`}
                                             </option>
                                             ))}
                                    </Form.Select>
                                    )}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.sipmember_id?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Name</Form.Label>
                                <Form.Control placeholder="Enter Name" value={clientsName} disabled={true}/>
                            </Form.Group>
                        </Col>
                        
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Paid Amount</Form.Label>
                                <Controller
                                    name="sip_maturity_amount"
                                    control={control}
                                    render={({ field }) => <Form.Control type="number" {...field} isInvalid={!!errors.sip_maturity_amount}  placeholder="Enter Paid Amount" />}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.sip_maturity_amount?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Payment Mode</Form.Label>
                                <Controller
                                    name="sip_payment_mode"
                                    control={control}
                                    render={({ field }) => 
                                        <Form.Select
                                    {...field}
                                    isInvalid={!!errors.sip_payment_mode}>
                                        <option>Select Payment mode</option>
                                        <option value="Cash">Cash</option>
                                        <option value="UPI">UPI</option>
                                        <option value="Net banking">Net Banking</option>
                                    </Form.Select>
                                    }
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.sip_payment_mode?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Upload Document</Form.Label>
                                <Controller
                                    name="sip_maturity_doc"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Control
                                        type="file"
                                        onChange={(e) => {
                                            const target = e.target as HTMLInputElement;
                                            field.onChange(target.files ? target.files[0] : null); 
                                        }}
                                    />
                                    
                                    )}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Initiated By</Form.Label>
                                <Controller
                                    name="sip_payment_paidBy"
                                    control={control}
                                    defaultValue={userData.staff_id}
                                    render={({ field }) => <Form.Select
                                    {...field} onChange={(e)=>{field.onChange(e.target.value)}} disabled={(userData.staff_id == "0")?false:true}
                                    >
                                        <option>Select Staff</option>
                                        <option value="0">Super Admin</option>
                                        {staff.map((staff)=>(
                                            <option value={staff._id}>{staff.staff_name}</option>
                                        ))}
                                    </Form.Select>}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Paid Date</Form.Label>
                                <Controller
                                    name="sip_payment_paidDate"
                                    control={control}
                                    defaultValue={TodayDate}
                                    render={({ field }) => <Form.Control type="date" {...field} onChange={(e)=>{field.onChange(e.target.value)}} disabled={true}/>}
                                />
                            </Form.Group>
                        </Col>
                    {(userData.user_role_type == '0') && (
                                    <>
                                    <Col md={6}>
                                    <Form.Group className="mb-3">
                                    <Form.Label>Branch Name</Form.Label>
                                    <select className={(branchErr)?"form-control is-invalid":"form-control"} id="branch" value={clientbranch} onChange={(e)=>{handleBranchChange(e)}} >
                                            <option value="">-- Select --</option>
    
                                            {branches.map((branch) => (
                                                <option key={branch._id} value={branch._id}>
                                                    {branch.branch_name}
                                                </option>
                                                ))}
                                    </select>
                                    {(branchErr)?(<div className="invalid-feedback d-block">Please Select Branch</div>):''}
                                </Form.Group>
                                </Col>
                                </>
                                )}
                    </Row>

                    <div className="text-md-end mb-0">
                        <Button variant="primary" className="me-1" type="submit">
                            Update
                        </Button>
                        <Button variant="secondary" type="button" onClick={() => reset()}>
                            Reset
                        </Button>
                    </div>
                </form>
            </Card.Body>
        </Card>
    );
};

const EditMaturity = () => {
    usePageTitle({
        title: 'Maturity',
        breadCrumbItems: [
            {
                path: '/forms/maturity',
                label: 'Forms',
            },
            {
                path: '/forms/maturity',
                label: 'Maturity',
                active: true,
            },
        ],
    });

    return (
        <>
            <Row style={{ marginTop: '25px' }}>
                <Col lg={12}>
                    <EditMaturityForm />
                </Col>
            </Row>
        </>
    );
};

export default EditMaturity;
