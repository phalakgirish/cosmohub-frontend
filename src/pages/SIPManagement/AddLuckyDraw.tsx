import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import url from '../../env';
// hooks
import { usePageTitle } from '../../hooks';
import secureLocalStorage from 'react-secure-storage';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Define types
type LuckyDrawData = {
    month: string;
    memberId: string;
    rank: string;
    payemnt_status:string
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
    month: yup.string().required('Month is required'),
    memberId: yup.string().required('Member ID is required'),
    rank: yup.string().required('Rank is required'),
});

const LuckyDrawForm = () => {
    const StorageuserData:any = secureLocalStorage.getItem('userData');
    const userData:any = JSON.parse(StorageuserData);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [simembers, setSipMembers] = useState<SipMember[]>([]);
    const [clientbranch, setClientBranch] = useState('');
    const [branchErr,setBranchErr] = useState(false);
    const navigate = useNavigate();

    const { control, handleSubmit, reset,formState:{errors} } = useForm<LuckyDrawData>({
        resolver: yupResolver(schema),
    });

    const onSubmit =async  (formData: LuckyDrawData) => {

        if(userData.staff_branch == '0' && clientbranch == '')
        {
            setBranchErr(true);
        }
        else
        {
            var dataToPost = {
                luckydraw_month: formData.month,
                spimember_id:formData.memberId,
                luckydraw_rank: formData.rank,
                payment_status: formData.payemnt_status,
                branch_id:(userData.staff_branch =='0')?clientbranch:userData.staff_branch
            }

            try {
                const bearerToken = secureLocalStorage.getItem('login');
                const response = await fetch(`${url.nodeapipath}/luckydraw`, {
                    body: JSON.stringify(dataToPost),
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin':'*',
                        'Authorization': `Bearer ${bearerToken}`
                    },
                    
                });
                const result = await response.json();
                // console.log('Lucky Draw Added successful:', result);
                navigate('/all-luckydraw')
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
                <h4 className="header-title mt-0 mb-1">Lucky Draw Entry</h4>
                <p className="sub-header">Fill in the details to enter the lucky draw.</p>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Month</Form.Label>
                                <Controller
                                    name="month"
                                    control={control}
                                    render={({ field }) => <Form.Control type="month" {...field} isInvalid={!!errors.month} placeholder="Select Month" />}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.month?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                            
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Member ID</Form.Label>
                                <Controller
                                    name="memberId"
                                    control={control}
                                    render={({ field }) => (<Form.Select
                                    {...field}
                                    isInvalid={!!errors.memberId}
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
                                    {errors.memberId?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Select Rank</Form.Label>
                                <Controller
                                    name="rank"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Select {...field} isInvalid={!!errors.rank}>
                                            <option value="">Select Rank</option>
                                            <option value="1">1st</option>
                                            <option value="2">2nd</option>
                                            <option value="3">3rd</option>
                                            {/* Add more ranks if needed */}
                                        </Form.Select>
                                    )}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.rank?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Payment Status</Form.Label>
                                <Controller
                                    name="payemnt_status"
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

const AddLuckyDraw = () => {
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
                    <LuckyDrawForm />
                </Col>
            </Row>
        </>
    );
};

export default AddLuckyDraw;
