import { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Form, FormText, Modal } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import jsPDF from 'jspdf'; // To generate PDF
import url from '../../env';
// hooks
import { usePageTitle } from '../../hooks';
import secureLocalStorage from 'react-secure-storage';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Typeahead } from 'react-bootstrap-typeahead';

// Define types
type PaymentData = {
    sippayment_receiptno:string;
    sipmember_id: string;
    sip_amount: number;
    sip_payment_month:string;
    sip_penalty_amount: number;
    sip_penalty_month: string;
    sip_payment_mode: string;
    sip_payment_refno: string;
    sip_payment_receivedBy: string;
    sip_payment_receivedDate: Date;
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
type Staff = {
    _id: string;
    staff_id: string;
    staff_name: string
};

// Validation schema
const schema = yup.object().shape({
    sipmember_id: yup.string().required('Select SIP Member'),
    sip_amount: yup.number().required('SIP Amount is required').min(1,'Amount Is Greater Then 0'),
    sip_payment_month: yup.string().required('SIP Month is required'),
    sip_payment_mode: yup.string().required('Payment Mode is required'),
});

const EditPaymentForm = () => {
    const StorageuserData:any = secureLocalStorage.getItem('userData');
    const userData:any = JSON.parse(StorageuserData);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [simembers, setSipMembers] = useState<SipMember[]>([]);
    const { id } = useParams<{ id: string }>();
    const [staff, setStaff] = useState<Staff[]>([]);
    const [clientbranch, setClientBranch] = useState('');
    const [branchErr,setBranchErr] = useState(false);
    const navigate = useNavigate();
    const[errmsg,setErrmsg] = useState(" ");
    const [singleSelections, setSingleSelections] = useState<Option[]>([]);
    const [paymentModes,setPaymentModes] = useState('')
    const [showDeleteModal, setShowDeleteModal] = useState(false);




    const [sipMemberName,setSipMemberName] = useState('');
    var today = new Date();
    // var RecivedDate = today.toISOString().split('T')[0];
    const [receivedDate, setReceivedDate] = useState('')
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

    const handelPAddPaymentPreEvent = async (sipMember_id:any,sip_month:any)=>{
        try{
            const bearerToken = secureLocalStorage.getItem('login');
                const response = await fetch(`${url.nodeapipath}/sippayment/paymentprev?sipmember_id=${sipMember_id}&sip_month=${sip_month}`,{
                    method:'GET',
                    headers: {
                        'Content-Type':'application/json',
                        'Access-Control-Allow-Origin':'*',
                        'Authorization': `Bearer ${bearerToken}`
                        }
                });
                const data = await response.json();
                if (response.ok) {
                    // setStaff(data.staff || []);
                    // console.log(data);
                    // setValue('penaltyAmount',data.penaltyAmount);

                    return data.sipPaymentDetails;
                    
    
                } else {
                    console.error('Error fetching branches:', data);
                }
            }
            catch(error){
                console.log('Error while fetch data.', error); 
            }
    }

    const formatMonthDate = (dateString:any)=> {
        if(!dateString)
            return '';

        const [year, month] = dateString.split('-');
        
        // Create a date object using the year and month
        const date = new Date(`${year}-${month}-01`);
        
        // Format the month to get the full month name
        const options = { month: "long" };
        const monthName = new Intl.DateTimeFormat('en-US',{ month: 'long' }).format(date);
        
        return `${monthName}-${year}`;
    }

    const onSubmit = async(formData: PaymentData) => {
        // console.log('Form data:', formData);

        if(userData.staff_branch == '0' && clientbranch == '')
        {
            setBranchErr(true);
        }
        else
        {
            var sippaymentdetails:any = handelPAddPaymentPreEvent(formData.sipmember_id,formData.sip_payment_month)

            if(sippaymentdetails.length == 0)
            {
                var dataToPost = {
                    sippayment_receiptno:formData.sippayment_receiptno,
                    sipmember_id: formData.sipmember_id,
                    sipmember_name: sipMemberName,
                    sip_payment_month: formData.sip_payment_month,
                    sip_amount: formData.sip_amount,
                    sip_penalty_month: (formData.sip_penalty_month)?formData.sip_penalty_month:'',
                    sip_penalty_amount: (formData.sip_penalty_amount)?formData.sip_penalty_amount:0,
                    sip_payment_mode: formData.sip_payment_mode,
                    sip_payment_refno: (formData.sip_payment_refno)?formData.sip_payment_refno:'',
                    sip_payment_receivedBy: formData.sip_payment_receivedBy,
                    sip_payment_receivedDate: formData.sip_payment_receivedDate,
                    branch_id:(userData.staff_branch =='0')?clientbranch:userData.staff_branch
                }
                // console.log(dataToPost);
    
                try {
                    const bearerToken = secureLocalStorage.getItem('login');
                    const response = await fetch(`${url.nodeapipath}/sippayment/${id}`, {
                        body: JSON.stringify(dataToPost),
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin':'*',
                            'Authorization': `Bearer ${bearerToken}`
                        },
                        
                    });
                    const result = await response.json();
                    if (response.ok) {
                        toast.success(result.message || 'SIP Payment Updated successfully');
                        navigate('/all-payement')
                    } else {
                        // console.error('Error adding Payment', result);
                        toast.error(result.message || 'Failed to Update SIP Payment');
                    }
                    // console.log('Payment update  successful:', result);
                    
                } catch (error) {
                    // console.error('Error during Payment:', error);
                    toast.error('An error occurred during adding. Please try again.');
                }
            }
            else
            {
                var sipMemberDetails = simembers.filter((item:any)=> item._id == formData.sipmember_id);
                setErrmsg(`${formatMonthDate(formData.sip_payment_month)} payment for ${sipMemberDetails[0].sipmember_id} is already paid.`)
                handleOpenDeleteModal();
            }

            
        }
            
        // generatePDF(formData);
        
        
    };

    useEffect(()=>{
        var SipMemberData:any
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
                SipMemberData = data.sipmember
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

        const fetchPaymentData = async ()=>{
            const response = await fetch(`${url.nodeapipath}/sipPayment/${id}`,{
                method:'GET',
                headers: {
                    'Content-Type':'application/json',
                    'Access-Control-Allow-Origin':'*',
                    'Authorization': `Bearer ${bearerToken}`
                    }
            });
            const data = await response.json();
            console.log(data);

            if (data && data.sipPayment && Array.isArray(data.sipPayment) && data.sipPayment.length > 0) {
                const sipPaymentData = data.sipPayment[0]; // Access the first element in the branch array

                // Set form values using branchData
                for (const key in sipPaymentData) {
                    if (sipPaymentData.hasOwnProperty(key)) {
                        setValue(key as keyof PaymentData, sipPaymentData[key]);
                    }
                }

                var sipMemberdetails = await SipMemberData.filter((item:any)=> item._id == sipPaymentData.sipmember_id)
                setSingleSelections([{value:sipPaymentData.sipmember_id,label:`${sipMemberdetails[0].sipmember_id}-${sipMemberdetails[0].sipmember_name}`}])
                setReceivedDate(sipPaymentData.sip_payment_receivedDate.split('T')[0])
                setClientBranch(sipPaymentData.branch_id)
                setSipMemberName(sipPaymentData.sipmember_name)
            } else {
                throw new Error('Branch data is empty or invalid');
            }
            
        }
        fetchPaymentData();
    },[])

    // const handleSIPMemberChange = (e:any)=>{
    //     var Membername = simembers.filter((item)=> item._id == e.target.value)
        
    //     setSipMemberName(Membername[0].sipmember_name);
    // }

    const handleOpenDeleteModal = () => {

        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const handleSIPMemberChange = (e:any)=>{
        setSingleSelections(e)
        if(e.length>0)
        {
            var Membername = simembers.filter((item)=> item._id == e[0].value)
            // setSipmember_id(e[0].value);
            setSipMemberName(Membername[0].sipmember_name);
            // handleFetchPenaltyAmount(e[0].value,sipmember_month);
            // handelClientWallet(e[0].value);
            setValue('sipmember_id',e[0].value)
        }
        else
        {
            // setSipmember_id('');
            setSipMemberName('');
            // handleFetchPenaltyAmount('',sipmember_month);
            // handelClientWallet('');
            setValue('sipmember_id','')
            // setWalletBalance(0)
        }
        
    }

    const handelChangePaymentMode = (e:any)=>{
        // console.log(e.target.value);

        setPaymentModes(e.target.value)
        
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
                        <h4 className="header-title mt-0 mb-1">Edit Payment</h4>
                        <p className="sub-header">Fill in the details to edit payment.</p>
                    </div>
                    <div className="text-md-end mb-0" style={{width:'82.7%'}}>
                        <Button variant="dark" type="reset" onClick={()=>{navigate('/all-payement')}}>
                            Back
                        </Button>
                    </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                    <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label> Reciept. No.</Form.Label>
                                <Controller
                                    name="sippayment_receiptno"
                                    control={control}
                                    render={({ field }) => <Form.Control {...field} placeholder="Enter Payment Ref. No." disabled={true}/>}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>SIP Member ID</Form.Label>
                                <Controller
                                    name="sipmember_id"
                                    control={control}
                                    render={({ field }) => (
                                //     <Form.Select
                                //     {...field}
                                //     isInvalid={!!errors.sipmember_id}
                                //     onChange={(e)=>{field.onChange(e.target.value); handleSIPMemberChange(e)}}
                                //     >
                                //         <option>Select SIP Member</option>
                                //         {simembers.map((member) => (
                                //              <option key={member._id} value={member._id}>
                                //                  {`${member.sipmember_id}, ${member.sipmember_name}`}
                                //              </option>
                                //              ))}
                                //     </Form.Select>
                                //     )}
                                // />
                                // <Form.Control.Feedback type="invalid">
                                //     {errors.sipmember_id?.message}
                                // </Form.Control.Feedback>

                                <Typeahead
                                        id="select2"
                                        labelKey={'label'}
                                        {...field}
                                        isInvalid={!!errors.sipmember_id}
                                        multiple={false}
                                        
                                        onChange={(e)=>{handleSIPMemberChange(e)}}
                                        options={simembers.map((member:any) => (
                                            {value:`${member._id}`,label:`${member.sipmember_id}, ${member.sipmember_name}`}
                                        ))}
                                        placeholder="select Client"
                                        selected={singleSelections}
                                    />
                                    )}
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                    {errors.sipmember_id?.message} */}

                                    {errors.sipmember_id && <div className="invalid-feedback d-block">{errors.sipmember_id.message}</div>}
                                {/* </Form.Control.Feedback> */}
                            </Form.Group>
                        </Col>
                        
                    </Row>
                     <Row>
                     <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>SIP Member Name</Form.Label>
                                <Form.Control placeholder="Enter Name" value={sipMemberName} disabled={true}/>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>SIP Amount</Form.Label>
                                <Controller
                                    name="sip_amount"
                                    control={control}
                                    defaultValue={1250}
                                    rules={{
                                        min: { value: 1, message: "Amount must be greater than 0" } // Additional validation rule
                                    }}
                                    render={({ field }) => <Form.Control type="number" {...field} value={field.value || ''} onChange={(e)=>{field.onChange(e.target.value)}} isInvalid={!!errors.sip_amount} placeholder="Enter SIP Amount" />}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.sip_amount?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        
                    </Row>
                   <Row>
                   <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>SIP Month</Form.Label>
                                {/* <Controller
                                    name="sip_payment_month"
                                    control={control}
                                    render={({ field }) => (<Form.Select
                                    {...field}
                                    isInvalid={!!errors.sip_payment_month}>
                                        <option>Select Month</option>
                                        {Months.map((months)=>
                                        <option value={months.value}>{months.lable}</option>
                                        )}
                                    </Form.Select>)}
                                /> */}
                                <Controller
                                    name="sip_payment_month"
                                    control={control}
                                    render={({ field }) => <Form.Control type="month" {...field} isInvalid={!!errors.sip_payment_month} placeholder="Select Month" />}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.sip_payment_month?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Penalty Amount</Form.Label>
                                <Controller
                                    name="sip_penalty_amount"
                                    control={control}
                                    render={({ field }) => <Form.Control {...field} value={field.value || ''} placeholder="Enter Penalty Amount" />}
                                />
                            </Form.Group>
                        </Col>
                        
                    </Row>
                    <Row>
                    <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Penalty Recovery Month</Form.Label>
                                {/* <Controller
                                    name="sip_penalty_month"
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
                                    name="sip_penalty_month"
                                    control={control}
                                    render={({ field }) => <Form.Control type="month" {...field} placeholder="Select Month" />}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Payment Mode</Form.Label>
                                <Controller
                                    name="sip_payment_mode"
                                    control={control}
                                    render={({ field }) => <Form.Select
                                    {...field}
                                    onChange={(e)=>{field.onChange(e.target.value);handelChangePaymentMode(e)}}
                                    isInvalid={!!errors.sip_payment_mode}>
                                        <option>Select Payment mode</option>
                                        <option value="Cash">Cash</option>
                                        <option value="UPI">UPI</option>
                                        <option value="Net banking">Net Banking</option>
                                    </Form.Select>}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.sip_payment_mode?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        
                    </Row>
                   <Row>
                   <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Payment Ref. No.</Form.Label>
                                <Controller
                                    name="sip_payment_refno"
                                    control={control}
                                    render={({ field }) => <Form.Control {...field} placeholder="Enter Payment Ref. No." disabled={(paymentModes == 'Cash' || paymentModes == 'Wallet')?true:false}/>}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Received By</Form.Label>
                                <Controller
                                    name="sip_payment_receivedBy"
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
                                <Form.Label>Received Date</Form.Label>
                                <Controller
                                    name="sip_payment_receivedDate"
                                    control={control}
                                    // defaultValue={receivedDate}
                                    render={({ field }) => <Form.Control type="date" {...field} onChange={(e)=>{field.onChange(e.target.value)}} disabled={true} value={receivedDate}/>}
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
                            Save
                        </Button>
                        <Button variant="secondary" type="button" onClick={() => reset()}>
                            Reset
                        </Button>
                    </div>
                </form>

            </Card.Body>
            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Alert</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errmsg}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteModal}>
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>
        </Card>
    );
};

const EditSIPPayment = () => {
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
                    <EditPaymentForm />
                </Col>
            </Row>
        </>
    );
};

export default EditSIPPayment;
