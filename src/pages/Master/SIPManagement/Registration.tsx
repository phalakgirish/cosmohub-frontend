import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';

import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import url from '../../../env';
import secureLocalStorage from 'react-secure-storage';
import { useNavigate } from 'react-router-dom';

interface ISIPFormInput {
    client_id: string;
    sipmember_bank_name: string;
    sipmember_account_number: string;
    sipmember_ifsc_code: string;
    sipmember_upi_id: string;
    sipmember_doj: string;
    // sipmember_maturity_date: string;
    sipmember_nominee_name: string;
    sipmember_nominee_age: string;
    sipmember_nominee_relation: string;
    sipmember_nominee_mobile: string;
    sipmember_nominee_pancard: FileList;
    sipmember_nominee_addharcard: FileList;
    sipmember_status: string;
}

// Define the type for branch data
type Branch = {
    _id: string;
    branch_name: string;
};

// Define the type for Client data
type Client = {
    _id: string;
    client_id: string;
    client_name: string
};

const schema = yup.object().shape({
    client_id: yup.string().required('Client ID is required'),
    sipmember_bank_name: yup.string().required('Bank Name is required'),
    sipmember_account_number: yup.string().required('Account Number is required'),
    sipmember_ifsc_code: yup.string().required('IFSC Code is required'),
    sipmember_upi_id: yup.string().required('UPI ID is required'),
    sipmember_doj: yup.string().required('Date of Joining is required'),
    // sipmember_maturity_date: yup.string().required('Maturity Date is required'),
    sipmember_nominee_name: yup.string().required('Nominee Name is required'),
    sipmember_nominee_age: yup.mixed().required('Nominee Age is required'),
    sipmember_nominee_relation: yup.string().required('Nominee Relation is required'),
    sipmember_nominee_mobile: yup.string().required('Nominee Mobile Number is required'),
    sipmember_nominee_pancard: yup.mixed().required('Nominee PAN Card is required'),
    sipmember_nominee_addharcard: yup.mixed().required('Nominee Aadhar Card is required'),
    sipmember_status: yup.string().required('Block Status is required'),
});

const SIPRegistration = () => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const StorageuserData:any = secureLocalStorage.getItem('userData');
    const userData:any = JSON.parse(StorageuserData);
    const [clientbranch, setClientBranch] = useState('');
    const [clientsName, setClientsName] = useState('')
    const [sipmaturitydate,setSipMaturityDate] = useState('')
    const [branchErr,setBranchErr] = useState(false);



    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors },control,setValue } = useForm<ISIPFormInput>({
        resolver: yupResolver(schema),
    });

    useEffect(()=>{

                // Fetch branches from the backend
                const fetchClients = async () => {
                    try {
                        const bearerToken = secureLocalStorage.getItem('login');
                        const response = await fetch(`${url.nodeapipath}/all/client/${userData.staff_branch}`,{
                            method:'GET',
                            headers: {
                                'Content-Type':'application/json',
                                'Access-Control-Allow-Origin':'*',
                                'Authorization': `Bearer ${bearerToken}`
                                }
                        });
                        const data = await response.json();

                        
                        if (response.ok) {
                            setClients(data.client || []);

                        } else {
                            console.error('Error fetching branches:', data);
                        }
                    } catch (error) {
                        console.error('Error during API call:', error);
                    }
                };
        
                fetchClients();
                
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
},[])

    const onSubmit = async (data: ISIPFormInput) => {
        // console.log(data);
        if(userData.staff_branch == '0' && clientbranch == '')
        {
            setBranchErr(true);
        }
        else
        {
            const formData = new FormData();
            formData.append('client_id', data.client_id);
            formData.append('sipmember_name', clientsName);
            formData.append('sipmember_bank_name', data.sipmember_bank_name);
            formData.append('sipmember_account_number', data.sipmember_account_number);
            formData.append('sipmember_ifsc_code', data.sipmember_ifsc_code);
            formData.append('sipmember_upi_id', data.sipmember_upi_id);
            formData.append('sipmember_doj', data.sipmember_doj);
            formData.append('sipmember_maturity_date', sipmaturitydate);
            formData.append('sipmember_nominee_name', data.sipmember_nominee_name);
            formData.append('sipmember_nominee_age', data.sipmember_nominee_age);
            formData.append('sipmember_nominee_relation', data.sipmember_nominee_relation);
            formData.append('sipmember_nominee_mobile', data.sipmember_nominee_mobile);
            formData.append('sipmember_nominee_pancard', data.sipmember_nominee_pancard[0]);
            formData.append('sipmember_nominee_addharcard', data.sipmember_nominee_addharcard[0]);
            formData.append('sipmember_status', data.sipmember_status);
            formData.append('branch_id', (userData.staff_branch =='0')?clientbranch:userData.staff_branch);

        // const DataToPost = {
        //     client_id: data.client_id,
        //     sipmember_name: clientsName,
        //     sipmember_bank_name: data.sipmember_bank_name,
        //     sipmember_account_number: data.sipmember_account_number,
        //     sipmember_ifsc_code: data.sipmember_ifsc_code,
        //     sipmember_upi_id: data.sipmember_upi_id,
        //     sipmember_doj: (data.sipmember_doj).toString(),
        //     sipmember_maturity_date: (data.sipmember_maturity_date).toString(),
        //     sipmember_nominee_name: data.sipmember_nominee_name,
        //     sipmember_nominee_age: data.sipmember_nominee_age,
        //     sipmember_nominee_relation: data.sipmember_nominee_relation,
        //     sipmember_nominee_mobile: data.sipmember_nominee_mobile,
        //     sipmember_nominee_pancard: data.sipmember_nominee_pancard[0],
        //     sipmember_nominee_addharcard: data.sipmember_nominee_addharcard[0],
        //     sipmemberblock_status: data.sipmemberblock_status,
        //     branch_id: (userData.staff_branch =='0')?clientbranch:userData.staff_branch

        // }
        // console.log(DataToPost);
        
        
            try {
                const bearerToken = secureLocalStorage.getItem('login');
                const response = await fetch(`${url.nodeapipath}/sipmanagement`, {
                    body: formData,
                    method: 'POST',
                    headers: {
                        'Access-Control-Allow-Origin':'*',
                        'Authorization': `Bearer ${bearerToken}`
                    },
                });
                const result = await response.json();
                console.log('Registration successful:', result);
                navigate('/all-sipmember');
            } catch (error) {
                console.error('Error during registration:', error);
            }
        }
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

    const handleClientChange = (e:any)=>{
        var clientname = clients.filter((item)=> item._id == e.target.value)
        
        setClientsName(clientname[0].client_name);
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: keyof ISIPFormInput) => {
        const files = event.target.files;
        if (files) {
            setValue(fieldName, files);
        }
    };

    const handleDateChange = (e:any)=>{

        let newDate = new Date(e.target.value);
        newDate.setMonth(newDate.getMonth() + 30);

        const formattedDate = newDate.toISOString().split('T')[0];
        // console.log(formattedDate); 
        setSipMaturityDate(formattedDate);


    }

    return (
        <Container>
            <Row className="justify-content-center" style={{marginTop:'35px'}}>
                <Col>
                    <Card>
                        <Card.Body>
                        <h4 className="header-title mt-0 mb-1">Member Registration</h4>
                        <p className="sub-header">Fill the form to register a new member.</p>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Row>
                                    <Col md={6}>
                                    <div className="mb-3">
                                            <label htmlFor="client_id" className="form-label">Client ID</label>
                                            <select className="form-control" id="client_id" {...register('client_id')} onChange={(e)=>{handleClientChange(e)}}>
                                                    <option value="">-- Select --</option>
            
                                                    {clients.map((client) => (
                                                        <option key={client._id} value={client._id}>
                                                            {`${client.client_id}-${client.client_name}`}
                                                        </option>
                                                        ))}
                                            </select>
                                            {errors.client_id && <div className="invalid-feedback d-block">{errors.client_id.message}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="sipmember_bank_name" className="form-label">Bank Name</label>
                                            <input
                                                type="text"
                                                id="sipmember_bank_name"
                                                className="form-control"
                                                placeholder="Enter Bank Name"
                                                {...register('sipmember_bank_name')}
                                            />
                                            {errors.sipmember_bank_name && <div className="invalid-feedback d-block">{errors.sipmember_bank_name.message}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="sipmember_ifsc_code" className="form-label">IFSC Code</label>
                                            <input
                                                type="text"
                                                id="sipmember_ifsc_code"
                                                className="form-control"
                                                placeholder="Enter IFSC Code"
                                                {...register('sipmember_ifsc_code')}
                                            />
                                            {errors.sipmember_ifsc_code && <div className="invalid-feedback d-block">{errors.sipmember_ifsc_code.message}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="sipmember_doj" className="form-label">Date of Joining</label>
                                            <input
                                                type="date"
                                                id="sipmember_doj"
                                                className="form-control"
                                                {...register('sipmember_doj')}
                                                onChange={(e)=>{handleDateChange(e)}}
                                            />
                                            {errors.sipmember_doj && <div className="invalid-feedback d-block">{errors.sipmember_doj.message}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="sipmember_nominee_name" className="form-label">Nominee Name</label>
                                            <input
                                                type="text"
                                                id="sipmember_nominee_name"
                                                className="form-control"
                                                placeholder="Enter Nominee Name"
                                                {...register('sipmember_nominee_name')}
                                            />
                                            {errors.sipmember_nominee_name && <div className="invalid-feedback d-block">{errors.sipmember_nominee_name.message}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="sipmember_nominee_relation" className="form-label">Nominee Relation</label>
                                            <input
                                                type="text"
                                                id="sipmember_nominee_relation"
                                                className="form-control"
                                                placeholder="Enter Nominee Relation"
                                                {...register('sipmember_nominee_relation')}
                                            />
                                            {errors.sipmember_nominee_relation && <div className="invalid-feedback d-block">{errors.sipmember_nominee_relation.message}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="sipmember_nominee_pancard" className="form-label">Nominee PAN Card</label>
                                            <Form.Control
                                                type="file"
                                                onChange={(event) => handleFileChange(event as React.ChangeEvent<HTMLInputElement>,'sipmember_nominee_pancard')}
                                                isInvalid={!!errors.sipmember_nominee_pancard}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.sipmember_nominee_pancard?.message}
                                            </Form.Control.Feedback>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="sipmember_status" className="form-label">Status</label>
                                            <select className="form-control" id="sipmember_status" {...register('sipmember_status')} onChange={(e)=>{handleClientChange(e)}}>
                                            <option value="">-- Select --</option>
                                            <option value="continued">Continued</option>
                                            <option value="discontinued">Discontinued</option>

                                            </select>
                                            {errors.sipmember_status && <div className="invalid-feedback d-block">{errors.sipmember_status.message}</div>}
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className="mb-3">
                                            <label htmlFor="sipmember_name" className="form-label">Member Name</label>
                                            <input
                                                type="text"
                                                id="sipmember_name"
                                                className="form-control"
                                                value={clientsName}
                                                placeholder="Member Name"
                                                disabled={true}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="sipmember_account_number" className="form-label">Account Number</label>
                                            <input
                                                type="text"
                                                id="sipmember_account_number"
                                                className="form-control"
                                                placeholder="Enter Account Number"
                                                {...register('sipmember_account_number')}
                                            />
                                            {errors.sipmember_account_number && <div className="invalid-feedback d-block">{errors.sipmember_account_number.message}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="sipmember_upi_id" className="form-label">UPI ID</label>
                                            <input
                                                type="text"
                                                id="sipmember_upi_id"
                                                className="form-control"
                                                placeholder="Enter UPI ID"
                                                {...register('sipmember_upi_id')}
                                            />
                                            {errors.sipmember_upi_id && <div className="invalid-feedback d-block">{errors.sipmember_upi_id.message}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="sipmember_maturity_date" className="form-label">Maturity Date</label>
                                            <input
                                                type="date"
                                                id="sipmember_maturity_date"
                                                className="form-control"
                                                disabled = {true}
                                                value={sipmaturitydate}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="sipmember_nominee_age" className="form-label">Nominee Age</label>
                                            <input
                                                type="text"
                                                id="sipmember_nominee_age"
                                                className="form-control"
                                                placeholder="Enter Nominee Age"
                                                {...register('sipmember_nominee_age')}
                                            />
                                            {errors.sipmember_nominee_age && <div className="invalid-feedback d-block">{errors.sipmember_nominee_age.message}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="sipmember_nominee_mobile" className="form-label">Nominee Mobile Number</label>
                                            <input
                                                type="text"
                                                id="sipmember_nominee_mobile"
                                                className="form-control"
                                                placeholder="Enter Nominee Mobile Number"
                                                {...register('sipmember_nominee_mobile')}
                                            />
                                            {errors.sipmember_nominee_mobile && <div className="invalid-feedback d-block">{errors.sipmember_nominee_mobile.message}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="sipmember_nominee_addharcard" className="form-label">Nominee Aadhar Card</label>
                                            <Form.Control
                                                type="file"
                                                onChange={(event) => handleFileChange(event as React.ChangeEvent<HTMLInputElement>,'sipmember_nominee_addharcard')}
                                                isInvalid={!!errors.sipmember_nominee_addharcard}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.sipmember_nominee_addharcard?.message}
                                            </Form.Control.Feedback>
                                        </div>
                                        {(userData.user_role_type == '0') && (
                                        <>
                                        <div className="mb-3">
                                            <label htmlFor="branch_id" className="form-label">Branch ID</label>
                                            <select className="form-control" id="branch" onChange={(e)=>{handleBranchChange(e)}} >
                                                    <option value="">-- Select --</option>
            
                                                    {branches.map((branch) => (
                                                        <option key={branch._id} value={branch._id}>
                                                            {branch.branch_name}
                                                        </option>
                                                        ))}
                                            </select>
                                            {(branchErr)?(<div className="invalid-feedback d-block">Please Select Branch</div>):''}
                                        </div>
                                        </>
                                        )}
                                    </Col>
                                </Row>
                                <Button variant="primary" type="submit">Register</Button>
                            </form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default SIPRegistration;
