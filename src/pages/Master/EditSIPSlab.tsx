import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Nouislider from 'nouislider-react';
import 'nouislider/distribute/nouislider.css';
import url from '../../env';
import secureLocalStorage from 'react-secure-storage';
import { usePageTitle } from '../../hooks';

// Define the type for SIP Slab data
type SIPSlabData = {
    duration: [number, number];
    rank: number;
    amount: number;
    type: string;
    sip_status: string;
};

type Branch = {
    _id: string;
    branch_name: string;
};

// Function to get the authorization token from secure local storage
const getBearerToken = () => {
    return secureLocalStorage.getItem('login'); // Adjust if your method differs
};

const EditSIPSlabForm = () => {
    const [sipSlab, setSipSlab] = useState<SIPSlabData | null>(null);
    const { id } = useParams<{ id: string }>(); // Get SIP Slab ID from route params
    const [duration, setDuration] = useState<[number, number]>([1, 40]);

    const StorageuserData:any = secureLocalStorage.getItem('userData');
    const [branches, setBranches] = useState<Branch[]>([]);
    const [clientbranch, setClientBranch] = useState('');
    const navigate = useNavigate();

    const userData:any = JSON.parse(StorageuserData);

    useEffect(() => {
        // Fetch SIP Slab data by ID
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

        const fetchSIPSlab = async () => {
            try {
                const bearerToken = getBearerToken();
                const response = await fetch(`${url.nodeapipath}/sipslab/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin':'*',
                        'Authorization': `Bearer ${bearerToken}`,
                    },
                });
                const data = await response.json();
                console.log(data);
                
                if (response.ok) {
                    // setSipSlab(data.sipSlab);
                    const sipslabData = data.sips[0]; // Access the first element in the branch array

                    // Set form values using branchData
                    for (const key in sipslabData) {
                        if (sipslabData.hasOwnProperty(key)) {
                            setValue(key as keyof SIPSlabData, sipslabData[key]);
                        }
                    }

                    setClientBranch(sipslabData.branch_id)
                    setDuration(sipslabData.duration)
                } else {
                    console.error('Error fetching SIP Slab:', data);
                }
            } catch (error) {
                console.error('Error during API call:', error);
            }
        };

        fetchSIPSlab();
    }, [id]);

    const handleBranchChange = (e:any)=>{
        setClientBranch(e.target.value)
    }

    // Form validation schema
    const schemaResolver = yupResolver(
        yup.object().shape({
            duration: yup
                .array()
                .of(
                    yup
                        .number()
                        .required('Please enter the duration in years')
                        .max(40, 'Duration cannot be more than 40 years')
                )
                .length(2),
            amount: yup.string().required('Please enter the amount'),
            type: yup.string().required('Please select the type'),
            sip_status: yup.string().required('Please select the SIP status'),
        })
    );

    const { handleSubmit, control, setValue, formState: { errors } } = useForm<SIPSlabData>({
        resolver: schemaResolver,
        defaultValues: sipSlab || {},
    });

    // useEffect(() => {
    //     if (sipSlab) {
    //         // Set form values when SIP Slab data is available
    //         setValue('duration', sipSlab.duration);
    //         setValue('amount', sipSlab.amount);
    //         setValue('type', sipSlab.type);
    //         setValue('sip_status', sipSlab.sip_status);
    //     }
    // }, [sipSlab, setValue]);

    const onSubmit = async (data: SIPSlabData) => {
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
            const bearerToken = getBearerToken();
            const response = await fetch(`${url.nodeapipath}/sipslab/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin':'*',
                    'Authorization': `Bearer ${bearerToken}`,
                },
                body: JSON.stringify(DataToPost),
            });

            const result = await response.json();

            if (response.ok) {
                console.log('SIP Slab updated successfully:', result);
                navigate('/sipslab');
            } else {
                console.error('Error updating SIP Slab:', result);
            }
        } catch (error) {
            console.error('Error during API call:', error);
        }
    };

    return (
        <Card style={{marginTop:'25px'}}>
            <Card.Body>
                <h4 className="header-title mt-0 mb-1">Edit SIP Slab</h4>
                <p className="sub-header">Update the SIP slab details.</p>
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
                                            // setValue('duration', [roundedValues[0], roundedValues[1]]);
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
                                        type="text"
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
                                 <select className="form-control" id="branch" onChange={(e)=>{handleBranchChange(e)}} value={clientbranch}>
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
                                Update
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

const EditSIPSlab = () => {
    usePageTitle({
        title: 'Edit SIP Slab',
        breadCrumbItems: [
            {
                path: '/forms/sipslab',
                label: 'Forms',
            },
            {
                path: '/forms/sipslab/edit',
                label: 'Edit SIP Slab',
                active: true,
            },
        ],
    });

    return (
        <Row>
            <Col lg={12}>
                <EditSIPSlabForm />
            </Col>
        </Row>
    );
};

export default EditSIPSlab;
