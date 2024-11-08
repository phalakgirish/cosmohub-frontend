import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { usePageTitle } from '../../hooks';
import secureLocalStorage from 'react-secure-storage';
import url from '../../env';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Define the type for form data
type ClientRegistrationData = {
    client_name: string;
    client_dob: string;
    client_mobile_number: string;
    client_emailId: string;
    client_gender: string;
    client_pancard: FileList;
    client_addharcard: FileList;
    client_postaladdress: string;
    client_landmark: string;
    client_status: boolean;
};

// Define the type for branch data
type Branch = {
    _id: string;
    branch_name: string;
};

// Validation schema
const schemaResolver = yupResolver(
    yup.object().shape({
        client_name: yup.string().required('Please enter your name'),
        client_dob: yup.string().required('Please enter your date of birth'),
        client_mobile_number: yup.string().required('Please enter your mobile number'),
        client_emailId: yup.string().email('Invalid email format').required('Please enter your email'),
        client_gender: yup.string().required('Please select your gender'),
        client_pancard: yup.mixed().required('Please upload your PAN card'),
        client_addharcard: yup.mixed().required('Please upload your Aadhar card'),
        client_postaladdress: yup.string().required('Please enter your postal address'),
        client_landmark: yup.string().required('Please enter a landmark'),
        client_status: yup.boolean().required('Please enter a landmark'),

    })
);

const ClientRegistration = () => {

    const StorageuserData:any = secureLocalStorage.getItem('userData');
    const [branches, setBranches] = useState<Branch[]>([]);
    const [clientbranch, setClientBranch] = useState('');
    const [branchErr,setBranchErr] = useState(false);
    const navigate = useNavigate();

    const userData:any = JSON.parse(StorageuserData);
    // console.log(userData);
    
    const { handleSubmit, control, formState: { errors }, setValue } = useForm<ClientRegistrationData>({
        resolver: schemaResolver,
        defaultValues: {
            client_status: true, // Default value if needed
        },
    });

    const onSubmit = async (data: ClientRegistrationData) => {
        // console.log(data);
        // Handle form submission
            if(userData.staff_branch == '0' && clientbranch == '')
            {
                setBranchErr(true);
            }
            else
            {
                const formData = new FormData();
                formData.append('client_name', data.client_name);
                formData.append('client_dob', data.client_dob);
                formData.append('client_mobile_number', data.client_mobile_number);
                formData.append('client_emailId', data.client_emailId);
                formData.append('client_gender', data.client_gender);
                formData.append('client_pancard', data.client_pancard[0]);
                formData.append('client_addharcard', data.client_addharcard[0]);
                formData.append('client_postaladdress', data.client_postaladdress);
                formData.append('client_landmark', data.client_landmark);
                formData.append('client_status', data.client_status.toString());
                formData.append('branch_id', (userData.staff_branch =='0')?clientbranch:userData.staff_branch);

                try {
                    const bearerToken = secureLocalStorage.getItem('login');
                    const response = await fetch(`${url.nodeapipath}/client`, {
                        body: formData,
                        method: 'POST',
                        headers: {
                            // 'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin':'*',
                            'Authorization': `Bearer ${bearerToken}`
                        },
                        
                    });
                    const result = await response.json();

                    if (response.ok) {
                        toast.success(`Registration successful: ${result.message || 'Client registered successfully'}`);
                        navigate('/clients');
                    } else {
                        toast.error(`Registration failed: ${result.message || 'Failed to register client'}`);
                    }
                } catch (error) {
                    // console.error('Error during registration:', error);
                    toast.error('An error occurred during registration. Please try again.');
                }

            }
            

    };

    // Handle file input change manually
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: keyof ClientRegistrationData) => {
        const files = event.target.files;
        if (files) {
            setValue(fieldName, files);
        }
    };

    usePageTitle({
        title: 'Add Client',
        breadCrumbItems: [
            {
                path: '/client-registration',
                label: 'Client Registration',
                active: true,
            },
        ],
    });

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
        <Card style={{marginTop:'25px'}}>
            <Card.Body>
                <h4 className="header-title mt-0 mb-1">Add Client</h4>
                <p className="sub-header">Fill the form to add a new client.</p>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Controller
                                    name="client_name"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter your name"
                                            {...field}
                                            isInvalid={!!errors.client_name}
                                        />
                                    )}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.client_name?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Date of Birth</Form.Label>
                                <Controller
                                    name="client_dob"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Control
                                            type="date"
                                            placeholder="Select your date of birth"
                                            {...field}
                                            isInvalid={!!errors.client_dob}
                                        />
                                    )}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.client_dob?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Mobile Number</Form.Label>
                                <Controller
                                    name="client_mobile_number"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter your mobile number"
                                            {...field}
                                            isInvalid={!!errors.client_mobile_number}
                                        />
                                    )}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.client_mobile_number?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Controller
                                    name="client_emailId"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter your email"
                                            {...field}
                                            isInvalid={!!errors.client_emailId}
                                        />
                                    )}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.client_emailId?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Gender</Form.Label>
                                <Controller
                                    name="client_gender"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Select
                                            {...field}
                                            isInvalid={!!errors.client_gender}
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </Form.Select>
                                    )}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.client_gender?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>Status</Form.Label>
                                <Controller
                                    name="client_status"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Select
                                            {...field}
                                            value={field.value.toString()}
                                            onChange={(e) => field.onChange(e.target.value === 'true')} isInvalid={!!errors.client_status}>
                                            <option value="">Select status</option>
                                            <option value="true">Active</option>
                                            <option value="false">Inactive</option>
                                        </Form.Select>
                                    )}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.client_status?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Postal Address</Form.Label>
                                <Controller
                                    name="client_postaladdress"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter your postal address"
                                            {...field}
                                            isInvalid={!!errors.client_postaladdress}
                                        />
                                    )}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.client_postaladdress?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Landmark</Form.Label>
                                <Controller
                                    name="client_landmark"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter a landmark"
                                            {...field}
                                            isInvalid={!!errors.client_landmark}
                                        />
                                    )}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.client_landmark?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Aadhar Card Upload</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={(event) => handleFileChange(event as React.ChangeEvent<HTMLInputElement>,'client_addharcard')}
                                    isInvalid={!!errors.client_addharcard}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.client_addharcard?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>PAN Card Upload</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={(event) => handleFileChange(event as React.ChangeEvent<HTMLInputElement>,'client_pancard')}
                                    isInvalid={!!errors.client_pancard}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.client_pancard?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                            {(userData.user_role_type == '0') && (
                                <>
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
                             </>
                            )}
                           
                        </Col>
                    </Row>

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

export default ClientRegistration
