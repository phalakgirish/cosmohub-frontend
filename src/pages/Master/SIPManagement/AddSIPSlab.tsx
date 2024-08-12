import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Nouislider from 'nouislider-react';
import 'nouislider/distribute/nouislider.css';
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import url from '../../../env';


// Define the type for form data
type SIPSlabData = {
    duration: [number, number];
    rank: number;
    amount: number;
    type: string;
    sip_status: string;
};

// Define the type for branch data
type Branch = {
    _id: string;
    branch_name: string;
};

// Validation schema
const schemaResolver = yupResolver(
    yup.object().shape({
        duration: yup.array().of(
            yup.number()
                .required('Please enter the duration in years')
                .max(40, 'Duration cannot be more than 40 years')
        ).length(2),
        rank: yup.number().required('Please enter the rank'),
        amount: yup.number().required('Please enter the amount'),
        type: yup.string().required('Please select the type'),
        sip_status: yup.string().required('Please select the SIP status'),
    })
);

const AddSIPSlab = () => {
    const StorageuserData:any = secureLocalStorage.getItem('userData');
    const [branches, setBranches] = useState<Branch[]>([]);
    const [clientbranch, setClientBranch] = useState('');
    const navigate = useNavigate();

    const userData:any = JSON.parse(StorageuserData);

    const { handleSubmit, control, formState: { errors } } = useForm<SIPSlabData>({
        resolver: schemaResolver,
    });

    const [duration, setDuration] = useState<[number, number]>([1, 40]);

    useEffect(() => {
        // Fetch branches from the backend
        const fetchBranches = async () => {
            try {
                const bearerToken = secureLocalStorage.getItem('login');
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
    }, []);

    const onSubmit = async (data: SIPSlabData) => {
        // console.log(formData);
        // Handle form submission

            // const formData = new FormData();
            // formData.append('sip_slab_from', data.duration[0].toString());
            // formData.append('sip_slab_to', data.duration[1].toString());
            // formData.append('sip_rank', data.rank.toString());
            // formData.append('sip_amount', data.amount.toString());
            // formData.append('sip_type', data.type);
            // formData.append('sip_status', data.sip_status);
            // formData.append('branch_id', (userData.staff_branch =='0')?clientbranch:userData.staff_branch);

            var DataToPost = {
                sip_slab_from:  data.duration[0],
                sip_slab_to: data.duration[1],
                sip_rank: data.rank,
                sip_amount: data.amount,
                sip_type: data.type,
                sip_status: data.sip_status,
                branch_id:(userData.staff_branch =='0')?clientbranch:userData.staff_branch
            }

            try {
                const bearerToken = secureLocalStorage.getItem('login');
                const response = await fetch(`${url.nodeapipath}/sipslab`, {
                    body: JSON.stringify(DataToPost),
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin':'*',
                        'Authorization': `Bearer ${bearerToken}`
                    },
                    
                });
                const result = await response.json();
                console.log('SIP Slab Add successfully:');
                navigate('/sipslab')
            } catch (error) {
                console.error('Error during registration:', error);
            }


    };

    const handleBranchChange = (e:any)=>{
        setClientBranch(e.target.value)
    }

    return (
        <Card style={{marginTop:'25px'}}>
            <Card.Body>
                <h4 className="header-title mt-0 mb-1">Add SIP Slab</h4>
                <p className="sub-header">Fill the form to add a new SIP slab.</p>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-2">
                        <Form.Label>Duration (in months): {duration[0]} - {duration[1]}</Form.Label>
                        <Controller
                            name="duration"
                            control={control}
                            render={({ field }) => (
                                <Nouislider
                                    range={{ min: 1, max: 40 }}
                                    start={duration}
                                    step={1}
                                    connect
                                    onSlide={(render, handle, value) => {
                                        const roundedValues = value.map(val => Math.round(val));
                                        setDuration([roundedValues[0], roundedValues[1]]);
                                        field.onChange([roundedValues[0], roundedValues[1]]);
                                    }}
                                />
                            )}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.duration && (errors.duration[0]?.message || errors.duration[1]?.message)}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Rank</Form.Label>
                        <Controller
                            name="rank"
                            control={control}
                            render={({ field }) => (
                                <Form.Control
                                    type="number"
                                    placeholder="Enter Rank"
                                    {...field}
                                    isInvalid={!!errors.rank}
                                />
                            )}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.rank?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Amount</Form.Label>
                        <Controller
                            name="amount"
                            control={control}
                            render={({ field }) => (
                                <Form.Control
                                    type="number"
                                    placeholder="Enter amount"
                                    {...field}
                                    isInvalid={!!errors.amount}
                                />
                            )}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.amount?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Type</Form.Label>
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <Form.Select {...field} isInvalid={!!errors.type}>
                                    <option value="">Select type</option>
                                    <option value="Slab">Slab</option>
                                    <option value="Fix">Fix</option>
                                </Form.Select>
                            )}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.type?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>SIP Status</Form.Label>
                        <Controller
                            name="sip_status"
                            control={control}
                            render={({ field }) => (
                                <Form.Select {...field} isInvalid={!!errors.sip_status}>
                                    <option value="">Select status</option>
                                    <option value="Continue">Continue</option>
                                    <option value="Discontinue">Discontinue</option>
                                </Form.Select>
                            )}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.sip_status?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                    {(userData.user_role_type == '0') && (
                                <>
                                 <Form.Group className="mb-2">
                                 <Form.Label>Branch Name</Form.Label>
                                 <select className="form-control" id="branch" onChange={(e)=>{handleBranchChange(e)}} >
                                         <option value="">-- Select --</option>
 
                                         {branches.map((branch) => (
                                             <option key={branch._id} value={branch._id}>
                                                 {branch.branch_name}
                                             </option>
                                             ))}
                                 </select>
                             </Form.Group>
                             </>
                            )}

                    <div className="text-md-end mb-0">
                        <Button variant="primary" className="me-1" type="submit">
                            Submit
                        </Button>
                        <Button variant="secondary" type="reset">
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

const SIPSlab = () => {
    return (
        <Row>
            <Col lg={12}>
                <AddSIPSlab />
            </Col>
        </Row>
    );
};

export default SIPSlab;
