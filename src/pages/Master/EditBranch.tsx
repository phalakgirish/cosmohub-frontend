import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import url from '../../env';
// hooks
import { usePageTitle } from '../../hooks';
import secureLocalStorage from 'react-secure-storage';
import { toast } from 'react-toastify';

type BranchData = {
    branch_code: string;
    branch_name: string;
    branch_contact_person: string;
    branch_mobile_number: string;
    branch_emailId: string;
    branch_area: string;
    branch_city: string;
    branch_district: string;
    branch_taluka: string;
    branch_pincode: string;
    branch_state: string
    branch_status: boolean;
};

const schemaResolver = yupResolver(
    yup.object().shape({
        branch_code: yup.string().required('Please enter Branch code'),
        branch_name: yup.string().required('Please enter Branch name'),
        branch_contact_person: yup.string().required('Please enter Contact Person'),
        branch_mobile_number: yup.string().required('Please enter Mobile Number'),
        branch_emailId: yup
            .string()
            .required('Please enter Email address')
            .email('Please enter a valid Email address'),
        branch_area: yup.string().required('Please enter Area'),
        branch_city: yup.string().required('Please enter City'),
        branch_district: yup.string().required('Please enter District'),
        branch_taluka: yup.string().required('Please enter Taluka'),
        branch_pincode: yup.string().required('Please enter Pincode'),
        branch_state: yup.string().required('Please enter state'),
        branch_status: yup.boolean().required('Please select Status'),
    })
);

const EditForm = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { control, handleSubmit, reset, setValue,formState:{errors} } = useForm<BranchData>({
        resolver: schemaResolver,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBranchData = async () => {
            try {
                const bearerToken = secureLocalStorage.getItem('login');
                const response = await fetch(`${url.nodeapipath}/branch/${id}`,{
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

                if (data && data.branch && Array.isArray(data.branch) && data.branch.length > 0) {
                    const branchData = data.branch[0]; // Access the first element in the branch array

                    // Set form values using branchData
                    for (const key in branchData) {
                        if (branchData.hasOwnProperty(key)) {
                            setValue(key as keyof BranchData, branchData[key]);
                        }
                    }
                } else {
                    throw new Error('Branch data is empty or invalid');
                }
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchBranchData();
    }, [id, setValue]);

    const onSubmit = async (formData: BranchData) => {
        try {
            const bearerToken = secureLocalStorage.getItem('login');
            const response = await fetch(`${url.nodeapipath}/branch/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin':'*',
                    'Authorization': `Bearer ${bearerToken}`
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            // if (!response.ok) {
                
            //     throw new Error(result.message || 'Error updating branch');
            // }
            if (response.ok) {
                toast.success(result.message || 'Branch updated successfully');
                navigate('/branch');
                
            } else {
                toast.error(result.message || 'Failed to update branch');
            }

             // Redirect after successful update
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
                toast.error('An error occurred during updating. Please try again.');
            } else {
                setError('An unknown error occurred during API call');
                toast.error('An error occurred during updating. Please try again.');
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Card style={{marginTop:'25px'}}>
            <Card.Body>
                <h4 className="header-title mt-0 mb-1">Edit Branch</h4>
                <p className="sub-header">Modify the details of the branch.</p>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Branch Code</Form.Label>
                                <Controller
                                    name="branch_code"
                                    control={control}
                                    render={({ field }) => <Form.Control {...field} isInvalid={!!errors.branch_code} placeholder="Enter Branch code" />}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.branch_code?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Branch Name</Form.Label>
                                <Controller
                                    name="branch_name"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Control {...field} placeholder="Enter Branch name" />
                                    )}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Contact Person</Form.Label>
                                <Controller
                                    name="branch_contact_person"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Control {...field} placeholder="Enter contact person name" />
                                    )}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Mobile Number</Form.Label>
                                <Controller
                                    name="branch_mobile_number"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Control {...field} placeholder="Enter mobile number" />
                                    )}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Email Address</Form.Label>
                                <Controller
                                    name="branch_emailId"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Control
                                            type="email"
                                            {...field}
                                            placeholder="Enter email address"
                                        />
                                    )}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Area</Form.Label>
                                <Controller
                                    name="branch_area"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Control {...field} placeholder="Enter area" />
                                    )}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>City</Form.Label>
                                <Controller
                                    name="branch_city"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Control {...field} placeholder="Enter city" />
                                    )}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>District</Form.Label>
                                <Controller
                                    name="branch_district"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Control {...field} placeholder="Enter district" />
                                    )}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Taluka</Form.Label>
                                <Controller
                                    name="branch_taluka"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Control {...field} placeholder="Enter taluka" />
                                    )}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Pincode</Form.Label>
                                <Controller
                                    name="branch_pincode"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Control {...field} placeholder="Enter pincode" />
                                    )}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>State</Form.Label>
                                <Controller
                                    name="branch_state"
                                    control={control}
                                    render={({ field }) => <Form.Control {...field} isInvalid={!!errors.branch_state} placeholder="Enter state" />}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.branch_state?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    <Col md={6}>
                            <Form.Group className="mb-2">
                                <Form.Label>Status</Form.Label>
                                <Controller
                                    name="branch_status"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Select
                                            {...field}
                                            value={field.value ? 'true' : 'false'}
                                            onChange={(e) =>
                                                field.onChange(e.target.value === 'true')
                                            }
                                        >
                                            <option value="">Select status</option>
                                            <option value="true">Active</option>
                                            <option value="false">Inactive</option>
                                        </Form.Select>
                                    )}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="text-md-end mb-0">
                        <Button variant="primary" className="me-1" type="submit">
                            Update
                        </Button>
                        <Button variant="secondary" onClick={() => navigate('/branch')}>
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default EditForm;
