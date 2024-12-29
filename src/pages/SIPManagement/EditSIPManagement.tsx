import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import url from '../../env';
import secureLocalStorage from 'react-secure-storage';
import { toast } from 'react-toastify';
import { Typeahead } from 'react-bootstrap-typeahead';

interface ISIPFormInput {
    sipmember_id: string;
    client_id: string;
    sipmember_name: string;
    sipmember_bank_name: string;
    sipmember_account_number: string;
    sipmember_ifsc_code: string;
    sipmember_upi_id: string;
    sipmember_doj: string;
    sipmember_maturity_date: string;
    sipmember_nominee_name: string;
    sipmember_nominee_age: string;
    sipmember_nominee_relation: string;
    sipmember_nominee_mobcode: string;
    sipmember_nominee_mobile: string;
    sipmember_nominee_otherdocs: FileList;
    sipmember_nominee_addharcard: FileList;
    sipmember_nominee_aadhaarno:string;
    sipmember_sip_category:string;
    sipmember_remarks:string;
    sipmember_status: string;
}

// Define the type for branch data
type Branch = {
    _id: string;
    branch_name: string;
};

type Option = string | Record<string, any>;

// Define the type for Client data
type Client = {
    _id: string;
    client_id: string;
    client_name: string;
    client_mobile_number: string;
};

type SIPCategory = {
    _id: string;
    sipcategory_name: string;
    sipcategory_status: string
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
    sipmember_nominee_age: yup.string().required('Nominee Age is required')
    .test('is-at-18-years-old', 'Nominee must be at least 18 year old.', (value) => {
        if (!value) return false;

        if(parseInt(value) < 18)
        return false;
        else
        return true
    }),
    sipmember_nominee_relation: yup.string().required('Nominee Relation is required'),
    sipmember_nominee_mobile: yup.string().required('Nominee Mobile Number is required'),
    sipmember_nominee_aadhaarno: yup.string().required('Nominee Aadhaar Number is required')
    .matches(/^\d+$/, "Nominee Aadhaar Number should contain only digits")
    .min(12, "Nominee Aadhaar Number must be at least 12 digit long")  // Minimum length
    .max(12, "Nominee Aadhaar Number must be at most 12 digit long"),
    sipmember_sip_category: yup.string().required('SIP Category required'),
    sipmember_status: yup.string().required('Block Status is required'),
});

const SIPEdit = () => {
    const { id } = useParams<{ id: string }>();
    const [branches, setBranches] = useState<Branch[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [category, setCategory] = useState<SIPCategory[]>([]);
    const StorageuserData:any = secureLocalStorage.getItem('userData');
    const userData:any = JSON.parse(StorageuserData);
    const [clientbranch, setClientBranch] = useState('');
    const [clientsName, setClientsName] = useState('')
    const [sipmaturitydate,setSipMaturityDate] = useState('')
    const [branchErr,setBranchErr] = useState(false);
    const [singleSelections, setSingleSelections] = useState<Option[]>([]);
    const navigate = useNavigate();

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<ISIPFormInput>({
        resolver: yupResolver(schema),
    });
    const [loading, setLoading] = useState(true);


    useEffect(()=>{
        var clientsData:any
        const bearerToken = secureLocalStorage.getItem('login');
            // Fetch branches from the backend
            const fetchClients = async () => {
                try {
                    
                    const response = await fetch(`${url.nodeapipath}/all/client/${userData.staff_branch}`,{
                        method:'GET',
                        headers: {
                            'Content-Type':'application/json',
                            'Access-Control-Allow-Origin':'*',
                            'Authorization': `Bearer ${bearerToken}`
                            }
                    });
                    const data = await response.json();
                    // console.log(data);
                    
                    clientsData = data.client
                    if (response.ok) {
                        setClients(data.client || []);

                    } else {
                        console.error('Error fetching branches:', data);
                    }
                } catch (error) {
                    console.error('Error during API call:', error);
                }
            };

            // fetchClients();
            

            const fetchSIPCategory = async () => {
                try {
                    const bearerToken = secureLocalStorage.getItem('login');
                    const response = await fetch(`${url.nodeapipath}/sipcategory`,{
                        method:'GET',
                        headers: {
                            'Content-Type':'application/json',
                            'Access-Control-Allow-Origin':'*',
                            'Authorization': `Bearer ${bearerToken}`
                            }
                    });
                    const data = await response.json();

                    console.log(data);
                    
                    if (response.ok) {
                        setCategory(data.sip_category || []);

                    } else {
                        console.error('Error fetching branches:', data);
                    }
                } catch (error) {
                    console.error('Error during API call:', error);
                }
            };
            // fetchSIPCategory();
            
        // Fetch branches from the backend
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
                
                if (response.ok) {
                    setBranches(data.branch || []);
                } else {
                    console.error('Error fetching branches:', data);
                }
            } catch (error) {
                console.error('Error during API call:', error);
            }
        };

        // fetchBranches();
 
        const fetchData = async () => {
            try {
                const response = await fetch(`${url.nodeapipath}/sipmanagement/${id}`,{
                    method:'GET',
                    headers: {
                        'Content-Type':'application/json',
                        'Access-Control-Allow-Origin':'*',
                        'Authorization': `Bearer ${bearerToken}`
                        }
                });
                const data =  await response.json();
                console.log(data);
                
                
                // Pre-fill form with fetched data

                if (response.ok && data.sip_member) {

                    await fetchClients();
                    await fetchSIPCategory();
                    await fetchBranches();
                    var sipMemberdetails = data.sip_member[0]
                    setValue("sipmember_id", sipMemberdetails.sipmember_id)
                    setValue("client_id", sipMemberdetails.client_id) 
                    var clientname = await clientsData.filter((item:any)=> item._id == sipMemberdetails.client_id)
                    setSingleSelections([{value:sipMemberdetails.client_id,label:`${clientname[0].client_id}-${clientname[0].client_name}`}])
                    setValue("sipmember_name",sipMemberdetails.sipmember_name)
                    setValue("sipmember_bank_name", sipMemberdetails.sipmember_bank_name)
                    setValue("sipmember_account_number", sipMemberdetails.sipmember_account_number)
                    setValue("sipmember_ifsc_code", sipMemberdetails.sipmember_ifsc_code)
                    setValue("sipmember_upi_id", sipMemberdetails.sipmember_upi_id)
                    setValue("sipmember_doj", new Date(sipMemberdetails.sipmember_doj).toISOString().substring(0, 10))
                    setValue("sipmember_maturity_date", new Date(sipMemberdetails.sipmember_maturity_date).toISOString().substring(0, 10))
                    // sipmember_maturity_date", sipMemberdetails.)
                    // handleDateChange({target:{value:new Date(sipMemberdetails.sipmember_doj).toISOString().substring(0, 10)}})
                    setValue("sipmember_nominee_name", sipMemberdetails.sipmember_nominee_name)
                    setValue("sipmember_nominee_age", sipMemberdetails.sipmember_nominee_age)
                    setValue("sipmember_nominee_relation", sipMemberdetails.sipmember_nominee_relation)
                    var phonecode = sipMemberdetails.sipmember_nominee_mobile.split('-');
                    setValue("sipmember_nominee_mobcode", phonecode[0])
                    setValue("sipmember_nominee_mobile", phonecode[1])
                    setValue("sipmember_nominee_aadhaarno", sipMemberdetails.sipmember_nominee_aadhaarno)
                    setValue("sipmember_sip_category", sipMemberdetails.sipmember_sip_category)
                    setValue("sipmember_remarks", sipMemberdetails.sipmember_remarks)
                    setValue("sipmember_status", sipMemberdetails.sipmember_status)
                    setClientBranch(sipMemberdetails.branch_id)
                }

                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch SIP member data:', error);
                setLoading(false);
            }
        };
        
        // setTimeout(()=>{fetchData();},3000)
        fetchData();
        
        
    },[])

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
        setValue('sipmember_maturity_date',formattedDate)


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

    const handleClientChange = (e:any)=>{
        console.log(e);
        setSingleSelections(e)
        if(e.length>0)
        {
            var clientname = clients.filter((item)=> item._id == e[0].value)
            setValue('sipmember_name',clientname[0].client_name);
            setValue('client_id',e[0].value);
        }
        else
        {
            setClientsName('');
            setValue('sipmember_name','');
            setValue('client_id','');
        } 
    }

    // Handle form submission
    const onSubmit = async (data: ISIPFormInput) => {
        console.log(data);
        // Handle form submission
        if(userData.staff_branch == '0' && clientbranch == '')
        {
            setBranchErr(true);
        }
        else
        {
            const formData = new FormData();
            formData.append("sipmember_id", data.sipmember_id);
            formData.append('client_id', data.client_id);
            formData.append('sipmember_name', data.sipmember_name);
            formData.append('sipmember_bank_name', data.sipmember_bank_name);
            formData.append('sipmember_account_number', data.sipmember_account_number);
            formData.append('sipmember_ifsc_code', data.sipmember_ifsc_code);
            formData.append('sipmember_upi_id', data.sipmember_upi_id);
            formData.append('sipmember_doj', data.sipmember_doj);
            formData.append('sipmember_maturity_date', data.sipmember_maturity_date);
            formData.append('sipmember_nominee_name', data.sipmember_nominee_name);
            formData.append('sipmember_nominee_age', data.sipmember_nominee_age);
            formData.append('sipmember_nominee_relation', data.sipmember_nominee_relation);
            formData.append('sipmember_nominee_mobile', `${data.sipmember_nominee_mobcode}-${data.sipmember_nominee_mobile}`);
            formData.append('sipmember_nominee_otherdocs', data.sipmember_nominee_otherdocs instanceof FileList ? data.sipmember_nominee_otherdocs[0]:'');
            formData.append('sipmember_nominee_addharcard', data.sipmember_nominee_addharcard instanceof FileList ? data.sipmember_nominee_addharcard[0]:'');
            formData.append('sipmember_nominee_aadhaarno', (data.sipmember_nominee_aadhaarno == null)?"":data.sipmember_nominee_aadhaarno);
            formData.append('sipmember_sip_category', data.sipmember_sip_category);
            formData.append('sipmember_remarks', data.sipmember_remarks);
            formData.append('sipmember_status', data.sipmember_status);
            formData.append('branch_id', (userData.staff_branch =='0')?clientbranch:userData.staff_branch);
            try 
            {
                const bearerToken = secureLocalStorage.getItem('login');
                const response = await fetch(`${url.nodeapipath}/sipmanagement/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Access-Control-Allow-Origin':'*',
                        'Authorization': `Bearer ${bearerToken}`
                    },
                    body: formData,
                });
                const result = await response.json();

                if (response.ok) {
                    toast.success(result.message || 'SIP Member updated successfully');
                    navigate('/all-sipmember'); // Adjust path as needed
                } else {
                    toast.error(result.message || 'Failed to update SIP Member');
                }
            } catch (error) {
                if (error instanceof Error) {
                    toast.error('An error occurred during updating. Please try again.');
                } else {
                    toast.error('An error occurred during updating. Please try again.');
                }
            }
        }
    };


    return (
        <Container style={{marginLeft:"0%"}}>
            <Row className="justify-content-center" style={{marginTop:'35px'}}>
                <Col>
                    <Card>
                        <Card.Body>
                            <div className='d-flex'>
                                <div>
                                    <h4 className="header-title mt-0 mb-1">Edit Member</h4>
                                    <p className="sub-header">Modify the member details.</p>
                                </div>
                                <div className="text-md-end mb-0" style={{width:'85%'}}>
                                    <Button variant="dark" type="reset" onClick={()=>{navigate('/all-sipmember')}}>
                                        Back
                                    </Button>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Row>
                                    <Col md={6}>
                                        <div className="mb-3">
                                            <label htmlFor="sipmember_id" className="form-label">Member Id</label>
                                            <input
                                                type="text"
                                                id="sipmember_id"
                                                className="form-control"
                                                placeholder="Member Id"
                                                {...register('sipmember_id')}
                                                disabled={true}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="sipmember_name" className="form-label">Member Name</label>
                                            <input
                                                type="text"
                                                id="sipmember_name"
                                                className="form-control"
                                                placeholder="Member Name"
                                                {...register('sipmember_name')}
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
                                                // disabled = {true}
                                                // value={sipmaturitydate}
                                                {...register('sipmember_maturity_date')}
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
                                            <div className="d-flex">
                                                <input
                                                    type="text"
                                                    id="sipmember_nominee_mobcode"
                                                    placeholder="code"
                                                    className="form-control"
                                                    {...register('sipmember_nominee_mobcode')}
                                                    disabled
                                                    style={{width:'10%'}}
                                                />
                                                <input
                                                    type="text"
                                                    id="sipmember_nominee_mobile"
                                                    placeholder="Enter Nominee Mobile Number"
                                                    className="form-control"
                                                    {...register('sipmember_nominee_mobile')}
                                                    style={{width:'90%'}}
                                                />
                                            </div>
                                            {errors.sipmember_nominee_mobile && <div className="invalid-feedback d-block">{errors.sipmember_nominee_mobile.message}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="sipmember_nominee_addharcard" className="form-label">Nominee Aadhar Card</label>
                                            <Form.Control
                                                type="file"
                                                onChange={(event:any) => handleFileChange(event as React.ChangeEvent<HTMLInputElement>,'sipmember_nominee_addharcard')}
                                                isInvalid={!!errors.sipmember_nominee_addharcard}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="sipmember_sip_category" className="form-label">SIP Category</label>
                                            <select className="form-control" id="sipmember_sip_category" {...register('sipmember_sip_category')}>
                                                    <option value="">-- Select --</option>
            
                                                    {category.map((category) => (
                                                        <option key={category._id} value={category._id}>
                                                            {category.sipcategory_name}
                                                        </option>
                                                        ))}
                                            </select>
                                            {errors.sipmember_sip_category && <div className="invalid-feedback d-block">{errors.sipmember_sip_category.message}</div>}
                                        </div>
                                        {(userData.user_role_type == '0') && (
                                        <>
                                        <div className="mb-3">
                                            <label htmlFor="branch_id" className="form-label">Branch ID</label>
                                            <select className="form-control" id="branch" onChange={(e)=>{handleBranchChange(e)}} value={clientbranch} >
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

                                    <Col md={6}>
                                        <div className="mb-3">
                                            <label htmlFor="client_id" className="form-label">Client ID</label>
                                            {/* <select className="form-control" id="client_id" {...register('client_id')} onChange={(e)=>{handleClientChange(e)}}>
                                                    <option value="">-- Select --</option>
            
                                                    {clients.map((client) => (
                                                        <option key={client._id} value={client._id}>
                                                            {`${client.client_id}-${client.client_name}`}
                                                        </option>
                                                        ))}
                                            </select> */}
                                            <Typeahead
                                                id="select2"
                                                labelKey={'label'}
                                                multiple={false}
                                                {...register('client_id')}
                                                onChange={(e)=>{handleClientChange(e)}}
                                                options={clients.map((client:any) => (
                                                    {value:`${client._id}`,label:`${client.client_id}-${client.client_name}`}
                                                ))}
                                                placeholder="select Client"
                                                selected={singleSelections}
                                            />
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
                                            <label htmlFor="sipmember_nominee_aadhaarno" className="form-label">Nominee Aadhaar Number</label>
                                            <input
                                                type="text"
                                                id="sipmember_nominee_aadhaarno"
                                                className="form-control"
                                                placeholder="Enter Nominee Mobile Number"
                                                {...register('sipmember_nominee_aadhaarno')}
                                            />
                                            {errors.sipmember_nominee_aadhaarno && <div className="invalid-feedback d-block">{errors.sipmember_nominee_aadhaarno.message}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="sipmember_nominee_otherdocs" className="form-label">Nominee Other Documents</label>
                                            <Form.Control
                                                type="file"
                                                onChange={(event:any) => handleFileChange(event as React.ChangeEvent<HTMLInputElement>,'sipmember_nominee_otherdocs')}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.sipmember_nominee_otherdocs?.message}
                                            </Form.Control.Feedback>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="sipmember_remarks" className="form-label">Remarks</label>
                                            <input
                                                type="text"
                                                id="sipmember_remarks"
                                                className="form-control"
                                                placeholder="Enter Remarks"
                                                {...register('sipmember_remarks')}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="sipmember_status" className="form-label">Status</label>
                                            <select className="form-control" id="sipmember_status" {...register('sipmember_status')} >
                                            <option value="">-- Select --</option>
                                            <option value="Continue">Continue</option>
                                            <option value="Discontinue">Discontinue</option>

                                            </select>
                                            {errors.sipmember_status && <div className="invalid-feedback d-block">{errors.sipmember_status.message}</div>}
                                        </div>
                                    </Col>
                                </Row>
                                <div className="text-md-end mb-0">
                                    <Button variant="primary" className="me-1" type="submit">
                                        Update
                                    </Button>
                                    <Button variant="secondary" type="reset" onClick={()=>{navigate('/all-sipmember')}}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default SIPEdit;
