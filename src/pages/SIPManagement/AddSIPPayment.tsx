import { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Form, FormText } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import jsPDF from 'jspdf'; // To generate PDF
import url from '../../env';
// hooks
import { usePageTitle } from '../../hooks';
import secureLocalStorage from 'react-secure-storage';
import { useNavigate } from 'react-router-dom';

// Define types
type PaymentData = {
    spi_Id: string;
    sipAmount: number;
    sipmonth:string;
    penaltyAmount: number;
    penaltyMonth: string;
    paymentMode: string;
    paymentRefNo: string;
    receivedBy: string;
    receivedDate: string;
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
type Staff = {
    _id: string;
    staff_id: string;
    staff_name: string
};

// Validation schema
const schema = yup.object().shape({
    spi_Id: yup.string().required('Select SIP Member'),
    sipAmount: yup.number().required('SIP Amount is required').min(1,'Amount Is Greater Then 0'),
    sipmonth: yup.string().required('SIP Month is required'),
    paymentMode: yup.string().required('Payment Mode is required'),
});

const PaymentForm = () => {
    const StorageuserData:any = secureLocalStorage.getItem('userData');
    const userData:any = JSON.parse(StorageuserData);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [simembers, setSipMembers] = useState<SipMember[]>([]);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [clientbranch, setClientBranch] = useState('');
    const [branchErr,setBranchErr] = useState(false);
    const navigate = useNavigate();


    const [sipMemberName,setSipMemberName] = useState('');
    var today = new Date();
    var TodayDate = today.toISOString().split('T')[0];
    const { control, handleSubmit, reset,formState: { errors }, setValue } = useForm<PaymentData>({
        resolver: yupResolver(schema),
    });
    var Months = [{value:'January',lable:'January'},
        {value:'February',lable:'February'},
        {value:'March',lable:'March'},
        {value:'April',lable:'April'},
        {value:'May',lable:'May'},
        {value:'June',lable:'June'},
        {value:'July',lable:'July'},
        {value:'August',lable:'August'},
        {value:'September',lable:'September'},
        {value:'October',lable:'October'},
        {value:'November',lable:'November'},
        {value:'December',lable:'December'}
    ]
    const generatePDF = (data: PaymentData) => {
        const doc = new jsPDF();
        doc.text('Payment Receipt', 20, 10);

        Object.keys(data).forEach((key, index) => {
            doc.text(`${key}: ${data[key as keyof PaymentData]}`, 20, 20 + (index * 10));
        });

        doc.save('payment_receipt.pdf'); 
    };

    const onSubmit = async(formData: PaymentData) => {
        // console.log('Form data:', formData);

        if(userData.staff_branch == '0' && clientbranch == '')
        {
            setBranchErr(true);
        }
        else
        {
            var dataToPost = {
                sipmember_id: formData.spi_Id,
                sipmember_name: sipMemberName,
                sip_payment_month: formData.sipmonth,
                sip_amount: formData.sipAmount,
                sip_penalty_month: (formData.penaltyMonth)?formData.penaltyMonth:'',
                sip_penalty_amount: (formData.penaltyAmount)?formData.penaltyAmount:0,
                sip_payment_mode: formData.paymentMode,
                sip_payment_refno: (formData.paymentRefNo)?formData.paymentRefNo:'',
                sip_payment_receivedBy: formData.receivedBy,
                sip_payment_receivedDate: formData.receivedDate,
                branch_id:(userData.staff_branch =='0')?clientbranch:userData.staff_branch
            }
            // console.log(dataToPost);
            generatePDF(formData);

            try {
                const bearerToken = secureLocalStorage.getItem('login');
                const response = await fetch(`${url.nodeapipath}/sippayment`, {
                    body: JSON.stringify(dataToPost),
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin':'*',
                        'Authorization': `Bearer ${bearerToken}`
                    },
                    
                });
                const result = await response.json();
                console.log('Payment successful:', result);
                navigate('/all-payement')
            } catch (error) {
                console.error('Error during Payment:', error);
            }
        }
            
        
        
        
    };

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

        const fetchSIPMember = async () => {
            try {
                const response = await fetch(`${url.nodeapipath}/all/spimember/${userData.staff_branch}`,{
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
        };

        fetchSIPMember();

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

        fetchStaff();
    },[])

    const handleSIPMemberChange = (e:any)=>{
        var Membername = simembers.filter((item)=> item._id == e.target.value)
        
        setSipMemberName(Membername[0].sipmember_name);
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
                <h4 className="header-title mt-0 mb-1">Payment Receipt</h4>
                <p className="sub-header">Fill in the details to generate a payment receipt.</p>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>SIP Member ID</Form.Label>
                                <Controller
                                    name="spi_Id"
                                    control={control}
                                    render={({ field }) => (<Form.Select
                                    {...field}
                                    isInvalid={!!errors.spi_Id}
                                    onChange={(e)=>{field.onChange(e.target.value); handleSIPMemberChange(e)}}
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
                                    {errors.spi_Id?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>SIP Member Name</Form.Label>
                                <Form.Control placeholder="Enter Name" value={sipMemberName} disabled={true}/>
                            </Form.Group>
                        </Col>
                    </Row>
                     <Row>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>SIP Amount</Form.Label>
                                <Controller
                                    name="sipAmount"
                                    control={control}
                                    defaultValue={1250}
                                    rules={{
                                        min: { value: 1, message: "Amount must be greater than 0" } // Additional validation rule
                                    }}
                                    render={({ field }) => <Form.Control type="number" {...field} value={field.value || ''} onChange={(e)=>{field.onChange(e.target.value)}} isInvalid={!!errors.sipAmount} placeholder="Enter SIP Amount" />}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.sipAmount?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>SIP Month</Form.Label>
                                {/* <Controller
                                    name="sipmonth"
                                    control={control}
                                    render={({ field }) => (<Form.Select
                                    {...field}
                                    isInvalid={!!errors.sipmonth}>
                                        <option>Select Month</option>
                                        {Months.map((months)=>
                                        <option value={months.value}>{months.lable}</option>
                                        )}
                                    </Form.Select>)}
                                /> */}
                                <Controller
                                    name="sipmonth"
                                    control={control}
                                    render={({ field }) => <Form.Control type="month" {...field} isInvalid={!!errors.sipmonth} placeholder="Select Month" />}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.sipmonth?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                   <Row>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Penalty Amount</Form.Label>
                                <Controller
                                    name="penaltyAmount"
                                    control={control}
                                    render={({ field }) => <Form.Control {...field} value={field.value || ''} placeholder="Enter Penalty Amount" />}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Penalty Month</Form.Label>
                                {/* <Controller
                                    name="penaltyMonth"
                                    control={control}
                                    render={({ field }) => (<Form.Select
                                    {...field} value={field.value || ""}>
                                        <option>Select Month</option>
                                        {Months.map((months)=>
                                        <option value={months.value}>{months.lable}</option>
                                        )}
                                    </Form.Select>)}
                                /> */}
                                <Controller
                                    name="penaltyMonth"
                                    control={control}
                                    render={({ field }) => <Form.Control type="month" {...field} placeholder="Select Month" />}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Payment Mode</Form.Label>
                                <Controller
                                    name="paymentMode"
                                    control={control}
                                    render={({ field }) => <Form.Select
                                    {...field}
                                    isInvalid={!!errors.paymentMode}>
                                        <option>Select Payment mode</option>
                                        <option value="Cash">Cash</option>
                                        <option value="UPI">UPI</option>
                                        <option value="Net banking">Net Banking</option>
                                    </Form.Select>}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.paymentMode?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Payment Ref. No.</Form.Label>
                                <Controller
                                    name="paymentRefNo"
                                    control={control}
                                    render={({ field }) => <Form.Control {...field} placeholder="Enter Payment Ref. No." />}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                   <Row>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Received By</Form.Label>
                                <Controller
                                    name="receivedBy"
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
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Received Date</Form.Label>
                                <Controller
                                    name="receivedDate"
                                    control={control}
                                    defaultValue={TodayDate}
                                    render={({ field }) => <Form.Control type="date" {...field} onChange={(e)=>{field.onChange(e.target.value)}} disabled={true}/>}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                    {(userData.user_role_type == '0') && (
                                <>
                                <Col md={6}>
                                 <Form.Group className="mb-3">
                                 <Form.Label>Branch Name</Form.Label>
                                 <select className={(branchErr)?"form-control is-invalid":"form-control"} id="branch" onChange={(e)=>{handleBranchChange(e)}} >
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
                            Save
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

const AddSIPPayment = () => {
    usePageTitle({
        title: 'SIP Payment',
        breadCrumbItems: [
            {
                path: '/forms/payment-receipt',
                label: 'Forms',
            },
            {
                path: '/forms/payment-receipt',
                label: 'Payment Receipt',
                active: true,
            },
        ],
    });

    return (
        <>
            <Row style={{ marginTop: '25px' }}>
                <Col lg={12}>
                    <PaymentForm />
                </Col>
            </Row>
        </>
    );
};

export default AddSIPPayment;
