import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Nouislider from 'nouislider-react';
import 'nouislider/distribute/nouislider.css';
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import url from '../../env';

import { usePageTitle } from '../../hooks';

import { toast } from 'react-toastify';


// Define the type for form data
type ReferenceLevelData = {
    refScheme_name: string;
    refScheme_category: string;
    refScheme_amount: number;
    refScheme_comission: string;
    refScheme_status: boolean;

};

// Define the type for branch data
type Branch = {
    _id: string;
    branch_name: string;
};

type Category = {
    _id: string;
    category_name: string;
    category_status:boolean;
};

// Validation schema
const schemaResolver = yupResolver(
    yup.object().shape({
        refScheme_name: yup.string().required('Please enter the scheme name'),
        refScheme_category: yup.string().required('Please select category'),
        refScheme_amount: yup.number().required('Please enter Scheme Amount'),
        refScheme_comission: yup.string().required('Please select the commission'),
        refScheme_status:yup.boolean().required('Please select status'),
    })
);

const AddReferenceScheme = () => {
    const StorageuserData:any = secureLocalStorage.getItem('userData');
    const [branches, setBranches] = useState<Branch[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [clientbranch, setClientBranch] = useState('');
    const [branchErr,setBranchErr] = useState(false);
    const navigate = useNavigate();

    const userData:any = JSON.parse(StorageuserData);

    const { handleSubmit, control, formState: { errors } } = useForm<ReferenceLevelData>({
        resolver: schemaResolver,
        defaultValues: {
            refScheme_status: true, // Default value if needed
        },
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

        const fetchCategory = async () => {
            try {
                const bearerToken = secureLocalStorage.getItem('login');
                const response = await fetch(`${url.nodeapipath}/category/`,{
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
                    setCategories(data.category || []);
                } else {
                    console.error('Error fetching branches:', data);
                }
            } catch (error) {
                console.error('Error during API call:', error);
            }
        };

        fetchCategory();
    }, []);

    const onSubmit = async (data: ReferenceLevelData) => {
        console.log(data);
        

            // if(userData.staff_branch == '0' && clientbranch == '')
            // {
            //     setBranchErr(true);
            // }
            // else
            // {
                var DataToPost = {
                    refScheme_name: data.refScheme_name,
                    refScheme_category: data.refScheme_category,
                    refScheme_amount: data.refScheme_amount,
                    refScheme_comission: data.refScheme_comission,
                    refScheme_status: data.refScheme_status,
                    // branch_id:(userData.staff_branch =='0')?clientbranch:userData.staff_branch
                    // branch_id:''
                }

                try {
                    const bearerToken = secureLocalStorage.getItem('login');
                    const response = await fetch(`${url.nodeapipath}/referencescheme`, {
                        body: JSON.stringify(DataToPost),
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin':'*',
                            'Authorization': `Bearer ${bearerToken}`
                        },
                        
                    });
                    const result = await response.json();
                    if (response.ok) {
                    // console.log('SIP Slab Add successfully:');
                        toast.success( result.message || 'Reference Scheme added successfully');
                        navigate('/all-refscheme')
                    }
                    else
                    {
                        toast.error(result.message || 'Failed to add reference scheme.');
                    }
                } catch (error) {
                    // console.error('Error during registration:', error);
                    toast.error('Failed to add reference level');
                }
            // }

    };

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
                <h4 className="header-title mt-0 mb-1">Add Reference Scheme</h4>
                <p className="sub-header">Fill the form to add a new reference scheme.</p>
                <Form onSubmit={handleSubmit(onSubmit)}>
                     <Form.Group className="mb-2">
                        <Form.Label>Scheme Name</Form.Label>
                        <Controller
                            name="refScheme_name"
                            control={control}
                            render={({ field }) => (
                                <Form.Control
                                    type="text"
                                    placeholder="Enter name"
                                    {...field}
                                    value={field.value ?? ""} // Fallback for undefined values
                                    onChange={(e) => field.onChange(e.target.value ? e.target.value : undefined)}
                                    isInvalid={!!errors.refScheme_name}
                                />
                            )}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.refScheme_name?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Scheme Category</Form.Label>
                        <Controller
                                    name="refScheme_category"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Select
                                            {...field}
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.target.value)} isInvalid={!!errors.refScheme_category}>
                                            <option value="">Select Category</option>
                                            {categories.map((category) => (
                                                <option key={category.category_name} value={category.category_name}>
                                                    {category.category_name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    )}
                                />
                        <Form.Control.Feedback type="invalid">
                            {errors.refScheme_category?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                     <Form.Group className="mb-2">
                        <Form.Label>Scheme Amount</Form.Label>
                        <Controller
                            name="refScheme_amount"
                            control={control}
                            render={({ field }) => (
                                <Form.Control
                                    type="number"
                                    placeholder="Enter bouns"
                                    {...field}
                                    value={field.value ?? ""} // Fallback for undefined values
                                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                    isInvalid={!!errors.refScheme_amount}
                                />
                            )}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.refScheme_amount?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Scheme Commision Type</Form.Label>
                        <Controller
                                    name="refScheme_comission"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Select
                                            {...field}
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.target.value)} isInvalid={!!errors.refScheme_comission}>
                                            <option value="">Select Type</option>
                                            <option value="Spot">Spot</option>
                                            <option value="Level">Level</option>
                                            <option value="Direct">Direct</option>
                                        </Form.Select>
                                    )}
                                />
                        <Form.Control.Feedback type="invalid">
                            {errors.refScheme_comission?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Scheme Status</Form.Label>
                        <Controller
                                    name="refScheme_status"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Select
                                            {...field}
                                            value={field.value.toString()}
                                            onChange={(e) => field.onChange(e.target.value === 'true')} 
                                            isInvalid={!!errors.refScheme_status}>
                                            <option value="">Select status</option>
                                            <option value="true">Active</option>
                                            <option value="false">Inactive</option>
                                        </Form.Select>
                                    )}
                                />
                        <Form.Control.Feedback type="invalid">
                            {errors.refScheme_status?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                    {/* {(userData.user_role_type == '0') && (
                                <>
                                 <Form.Group className="mb-2">
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
                            )} */}

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

const ReferenceScheme = () => {

    usePageTitle({
        title: 'Add Reference Scheme',
        breadCrumbItems: [
            {
                path: '/forms/validation',
                label: 'Forms',
            },
            {
                path: '/forms/validation',
                label: 'Validation',
                active: true,
            },
        ],
    });

    return (
        <Row>
            <Col lg={12}>
                <AddReferenceScheme />
            </Col>
        </Row>
    );
};

export default ReferenceScheme;
