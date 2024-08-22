import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { usePageTitle } from '../../hooks';
import secureLocalStorage from 'react-secure-storage';
import url from '../../env';
import { useNavigate, useParams } from 'react-router-dom';

// Define the type for form data
type ClientRegistrationData = {
    client_id:string;
    client_name: string;
    client_dob: string;
    client_mobile_number: string;
    client_emailId: string;
    client_gender: string;
    client_pancard: FileList;
    client_addharcard: FileList;
    client_postaladdress: string;
    client_landmark: string;
    client_status: string;
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
        client_postaladdress: yup.string().required('Please enter your postal address'),
        client_landmark: yup.string().required('Please enter a landmark'),
        client_status: yup.boolean().required('Please enter a Status'),

    })
);

const ClientEdit = () => {
    const { id } = useParams();
    const StorageuserData:any = secureLocalStorage.getItem('userData');
    const [branches, setBranches] = useState<Branch[]>([]);
    const [clientbranch, setClientBranch] = useState('');
    const [branchErr,setBranchErr] = useState(false);
    const [errFile, setErrFile] = useState(false);
    const [fileName, setFileName] = useState('');
    const [clientPancard, setClientPancard] = useState<File | null>(null);
    const [clientAadharcard, setClientAadharcard] = useState<File | null>(null);
    const [panFileStatus, setPanFileStatus] = useState(false);
    const [aadharFileStatus, setAadharFileStatus] = useState(false);
    const navigate = useNavigate();

    const userData:any = JSON.parse(StorageuserData);
    // console.log(userData);
    
    const { handleSubmit, control, formState: { errors }, setValue } = useForm<ClientRegistrationData>({
        resolver: schemaResolver,

    });

    const onSubmit = async (data: ClientRegistrationData) => {
        console.log(data);
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
                formData.append('client_pancard', data.client_pancard instanceof FileList ? data.client_pancard[0]:'');
                formData.append('client_addharcard', data.client_addharcard instanceof FileList ? data.client_addharcard[0]:'');
                formData.append('client_postaladdress', data.client_postaladdress);
                formData.append('client_landmark', data.client_landmark);
                formData.append('client_status', data.client_status);
                formData.append('branch_id', (userData.staff_branch =='0')?clientbranch:userData.staff_branch);

                try {
                    const bearerToken = secureLocalStorage.getItem('login');
                    const response = await fetch(`${url.nodeapipath}/client/${id}`, {
                        body: formData,
                        method: 'PUT',
                        headers: {
                            // 'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin':'*',
                            'Authorization': `Bearer ${bearerToken}`
                        },
                        
                    });
                    const result = await response.json();
                    console.log('Registration successful:', result);
                    navigate('/clients')
                } catch (error) {
                    console.error('Error during registration:', error);
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
        const fetchBranches = async () => {
            try {
                const bearerToken = secureLocalStorage.getItem('login');
                const response = await fetch(`${url.nodeapipath}/branch/all/all`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': `Bearer ${bearerToken}`,
                    }
                });
                const data = await response.json();

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

        const fetchClientDetails = async () => {
            try {
                const bearerToken = secureLocalStorage.getItem('login');
                const response = await fetch(`${url.nodeapipath}/client/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': `Bearer ${bearerToken}`,
                    },
                });
                const data = await response.json();
                console.log(data);
                
                if (response.ok && data.client) {
                    const clientDetails = data.client[0];
                    setValue('client_id',clientDetails.client_id)
                    setValue('client_name', clientDetails.client_name);
                    setValue('client_dob', new Date(clientDetails.client_dob).toISOString().substring(0, 10));
                    setValue('client_mobile_number', clientDetails.client_mobile_number);
                    setValue('client_emailId', clientDetails.client_emailId);
                    setValue('client_gender', clientDetails.client_gender);
                    setValue('client_postaladdress', clientDetails.client_postaladdress);
                    setValue('client_landmark', clientDetails.client_landmark);
                    setValue('client_status',clientDetails.client_status.toString())
                    setClientBranch(clientDetails.branch_id);

                } else {
                    console.error('Error fetching client details:', data);
                }
            } catch (error) {
                console.error('Error during API call:', error);
            }
        };

        fetchClientDetails();
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
                <h4 className="header-title mt-0 mb-1">Edit Client</h4>
                <p className="sub-header">Modify the client details below.</p>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label> Client Id</Form.Label>
                                <Controller
                                    name="client_id"
                                    control={control}
                                    render={({ field }) => <Form.Control {...field} value={field.value || ""} 
                                    placeholder="Enter Elient Id" disabled={true}/>}
                                />
                            </Form.Group>
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
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>PAN Card Upload</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={(event) => handleFileChange(event as React.ChangeEvent<HTMLInputElement>,'client_pancard')}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Status</Form.Label>
                                <Controller
                                    name="client_status"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Select
                                            {...field}
                                            value={field.value || ''}
                                            isInvalid={!!errors.client_status}>
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
                            {(userData.user_role_type == '0') && (
                                <>
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
                             </>
                            )}
                           
                        </Col>
                    </Row>

                    <div className="text-md-end mb-0">
                        <Button variant="primary" className="me-1" type="submit">
                            Update
                        </Button>
                        <Button variant="secondary" type="reset" onClick={()=>{navigate('/clients')}}>
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default ClientEdit
