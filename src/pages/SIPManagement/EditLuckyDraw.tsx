import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import url from '../../env';
// hooks
import { usePageTitle } from '../../hooks';
import secureLocalStorage from 'react-secure-storage';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

// Define types
type LuckyDrawData = {
    luckydraw_month: string;
    spimember_id: string;
    luckydraw_rank: string;
    payment_status:string
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

// Validation schema
const schema = yup.object().shape({
    luckydraw_month: yup.string().required('Month is required'),
    spimember_id: yup.string().required('Member ID is required'),
    luckydraw_rank: yup.string().required('Rank is required'),
});

const EditLuckyDrawForm = () => {
    const StorageuserData:any = secureLocalStorage.getItem('userData');
    const userData:any = JSON.parse(StorageuserData);
    const { id } = useParams<{ id: string }>();
    const [branches, setBranches] = useState<Branch[]>([]);
    const [simembers, setSipMembers] = useState<SipMember[]>([]);
    const [clientbranch, setClientBranch] = useState('');
    const [branchErr,setBranchErr] = useState(false);
    const navigate = useNavigate();

    const { control, handleSubmit, reset,formState:{errors},setValue } = useForm<LuckyDrawData>({
        resolver: yupResolver(schema),
    });

    const onSubmit =async  (formData: LuckyDrawData) => {

        // if(userData.staff_branch == '0' && clientbranch == '')
        // {
        //     setBranchErr(true);
        // }
        // else
        // {
            var dataToPost = {
                luckydraw_month: formData.luckydraw_month,
                spimember_id:formData.spimember_id,
                luckydraw_rank: formData.luckydraw_rank,
                payment_status: formData.payment_status,
                // branch_id:(userData.staff_branch =='0')?clientbranch:userData.staff_branch
                branch_id:''

            }

            try {
                const bearerToken = secureLocalStorage.getItem('login');
                const response = await fetch(`${url.nodeapipath}/luckydraw/${id}`, {
                    body: JSON.stringify(dataToPost),
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin':'*',
                        'Authorization': `Bearer ${bearerToken}`
                    },
                    
                });
                const result = await response.json();
                // console.log('Lucky Draw Added successful:', result);
                if (response.ok) {
                    toast.success(result.message || 'Luckydraw updated successfully');
                    navigate('/all-luckydraw')
                } else {
                    toast.error(result.message || 'Failed to update Luckydraw');
                }
                
            } catch (error) {
                // console.error('Error during Payment:', error);
                toast.error('An error occurred. Please try again.');

            }
            
        // }

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

        const fetchLuckDrawData = async ()=>{
            const response = await fetch(`${url.nodeapipath}/luckydraw/${id}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin':'*',
                    'Authorization': `Bearer ${bearerToken}`
                }});

            if (!response.ok) {
                throw new Error('Error fetching branch data');
            }
            const data = await response.json();
            // console.log(data);

            if (data && data.luckyDraw && Array.isArray(data.luckyDraw) && data.luckyDraw.length > 0) {
                const luckydrawData = data.luckyDraw[0]; // Access the first element in the branch array

                // Set form values using branchData
                for (const key in luckydrawData) {
                    if (luckydrawData.hasOwnProperty(key)) {
                        setValue(key as keyof LuckyDrawData, luckydrawData[key]);
                    }
                }
                setClientBranch(luckydrawData.branch_id)
            } else {
                throw new Error('Branch data is empty or invalid');
            }
            
        };

        fetchLuckDrawData();
    },[])

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
                    <h4 className="header-title mt-0 mb-1">Edit Lucky Draw Entry</h4>
                    <p className="sub-header">Fill in the details to enter the lucky draw.</p>
                    </div>
                    <div className="text-md-end mb-0" style={{width:'79%'}}>
                        <Button variant="dark" type="reset" onClick={()=>{navigate('/all-luckydraw')}}>
                            Back
                        </Button>
                    </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Month</Form.Label>
                                <Controller
                                    name="luckydraw_month"
                                    control={control}
                                    render={({ field }) => <Form.Control type="month" {...field} isInvalid={!!errors.luckydraw_month} placeholder="Select Month" />}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.luckydraw_month?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                            
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Member ID</Form.Label>
                                <Controller
                                    name="spimember_id"
                                    control={control}
                                    render={({ field }) => (<Form.Select
                                    {...field}
                                    isInvalid={!!errors.spimember_id}
                                    onChange={(e)=>{field.onChange(e.target.value);}}
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
                                    {errors.spimember_id?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Select Rank</Form.Label>
                                <Controller
                                    name="luckydraw_rank"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Select {...field} isInvalid={!!errors.luckydraw_rank}>
                                            <option value="">Select Rank</option>
                                            <option value="1">1st</option>
                                            <option value="2">2nd</option>
                                            <option value="3">3rd</option>
                                            {/* Add more ranks if needed */}
                                        </Form.Select>
                                    )}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.luckydraw_rank?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Payment Status</Form.Label>
                                <Controller
                                    name="payment_status"
                                    control={control}
                                    defaultValue={'Pending'}
                                    render={({ field }) => (
                                        <Form.Select {...field} disabled={true}>
                                            <option value="">Select status</option>
                                            <option value="Done">Done</option>
                                            <option value="Pending">Pending</option>
                                            {/* Add more ranks if needed */}
                                        </Form.Select>
                                    )}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                    {/* {(userData.user_role_type == '0') && (
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
                            )} */}
                    </Row>

                    <div className="text-md-end mb-0">
                        <Button variant="primary" className="me-1" type="submit">
                            Submit
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

const EditLuckyDraw = () => {
    usePageTitle({
        title: 'Lucky Draw',
        breadCrumbItems: [
            {
                path: '/forms/lucky-draw',
                label: 'Forms',
            },
            {
                path: '/forms/lucky-draw',
                label: 'Lucky Draw',
                active: true,
            },
        ],
    });

    return (
        <>
            <Row style={{ marginTop: '25px' }}>
                <Col lg={12}>
                    <EditLuckyDrawForm />
                </Col>
            </Row>
        </>
    );
};

export default EditLuckyDraw;
