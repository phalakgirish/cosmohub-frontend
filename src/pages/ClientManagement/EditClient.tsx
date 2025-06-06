import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { usePageTitle } from '../../hooks';
import secureLocalStorage from 'react-secure-storage';
import url from '../../env';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Typeahead } from 'react-bootstrap-typeahead';

// Define the type for form data
type ClientRegistrationData = {
    client_id:string;
    client_name: string;
    client_dob: string;
    client_phonecode: string;
    client_mobile_number: string;
    client_emailId: string;
    client_gender: string;
    client_otherdocs: FileList;
    client_addharcard: FileList;
    client_aadhaar_number: string;
    client_postaladdress: string;
    client_landmark: string;
    client_sip_refrence_level: number;
    client_refered_by:string;
    client_country: string;
    client_state: string;
    client_city: string;
    client_status: string;
    client_bank_name : string;
    client_bank_account_no : string;
    client_bank_ifsc : string;
    client_others: string;
    client_sip_refrence_family:boolean;
};

// Define the type for branch data
type Branch = {
    _id: string;
    branch_name: string;
};

type Option = string | Record<string, any>;

type Country = {
    _id: string;
    country_name: string;
    country_code: string;
    country_phonecode: string;
    phonenumber_length: number;
};

type State = {
    _id: string;
    state_name: string;
    state_code: string;
    state_country: string;
};

// Define the type for Client data
type Client = {
    _id: string;
    client_id: string;
    client_name: string
};

// Validation schema
const schemaResolver = yupResolver(
    yup.object().shape({
        client_name: yup.string().required('Please enter your name'),
        client_dob: yup.string().required('Please enter your date of birth')
        .test('is-at-least-one-year-back', 'Client must be atleast 1 year old.', (value) => {
            if (!value) return false;

            const dob = new Date(value);
            const today = new Date();
            const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
            return dob <= oneYearAgo;
        }),
        client_mobile_number: yup.string().required('Please enter your mobile number'),
        client_emailId: yup.string().email('Invalid email format'),
        client_gender: yup.string().required('Please select your gender'),
        client_aadhaar_number: yup.string().required('Please enter Aadhaar number'),
        client_postaladdress: yup.string().required('Please enter your postal address'),
        client_status: yup.boolean().required('Please enter a Status'),
        client_country: yup.string().required('Please select your country'),
        client_state: yup.string().required('Please select your state'),
        client_city: yup.string().required('please enter your city/village'),
        client_phonecode: yup.string().required(' '),

    })
);

const ClientEdit = () => {
    const { id } = useParams();
    const StorageuserData:any = secureLocalStorage.getItem('userData');
    const [branches, setBranches] = useState<Branch[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [clientbranch, setClientBranch] = useState('');
    const [clientsName, setClientsName] = useState<string | undefined>('')
    const [branchErr,setBranchErr] = useState(false);
    const [errFile, setErrFile] = useState(false);
    const [fileName, setFileName] = useState('');
    const [clientPancard, setClientPancard] = useState<File | null>(null);
    const [clientAadharcard, setClientAadharcard] = useState<File | null>(null);
    const [panFileStatus, setPanFileStatus] = useState(false);
    const [aadharFileStatus, setAadharFileStatus] = useState(false);
    const [singleSelections, setSingleSelections] = useState<Option[]>([]);
    const [clientName,setClientName] = useState('');
    const [phoneNumberLength, setPhoneNumberLength] = useState(0);
    const [phoneNumberValidation, setPhoneNumberValidation] = useState(true);
    const navigate = useNavigate();
    let countryData:any

    const userData:any = JSON.parse(StorageuserData);
    // console.log(userData);
    
    const { handleSubmit, control, formState: { errors }, setValue } = useForm<ClientRegistrationData>({
        resolver: schemaResolver,

    });


    const onSubmit = async (data: ClientRegistrationData) => {
        // console.log(data);  
        
        // Handle form submission
            if(!phoneNumberValidation)
            {
                return;
            }
            if(userData.staff_branch == '0' && clientbranch == '')
            {
                setBranchErr(true);
            }
            else
            {
                const formData = new FormData();
                formData.append('client_id',data.client_id);
                formData.append('client_name', data.client_name);
                formData.append('client_dob', data.client_dob);
                formData.append('client_mobile_number',`${data.client_phonecode}-${data.client_mobile_number}`);
                formData.append('client_emailId', data.client_emailId);
                formData.append('client_gender', data.client_gender);
                formData.append('client_otherdocs', data.client_otherdocs instanceof FileList ? data.client_otherdocs[0]:'');
                formData.append('client_addharcard', data.client_addharcard instanceof FileList ? data.client_addharcard[0]:'');
                formData.append('client_aadhaar_number', data.client_aadhaar_number);
                formData.append('client_postaladdress', data.client_postaladdress);
                formData.append('client_landmark', data.client_landmark);
                formData.append('sip_reference_level', data.client_sip_refrence_level.toString());
                formData.append('sip_refered_by_clientId', (data.client_refered_by == undefined || data.client_refered_by == null)?'null':data.client_refered_by);
                formData.append('client_country',data.client_country)
                formData.append('client_state',data.client_state)
                formData.append('client_city',data.client_city)
                formData.append('client_status', data.client_status);
                formData.append('branch_id', (userData.staff_branch =='0')?clientbranch:userData.staff_branch);
                formData.append('client_bank_name', data.client_bank_name == undefined ? '' : data.client_bank_name);
                formData.append('client_bank_account_no', data.client_bank_account_no == undefined ? '' : data.client_bank_account_no );
                formData.append('client_bank_ifsc', data.client_bank_ifsc == undefined ? '' : data.client_bank_ifsc);
                formData.append('client_others', data.client_others == undefined ? '' : data.client_others);
                formData.append('client_sip_refrence_family', data.client_sip_refrence_family.toString())


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
                    if (response.ok) {
                        toast.success(result.message || 'Client Updated successfully');
                        navigate('/clients')
                    } else {
                        toast.error(result.message || 'Failed to register client');
                    }
                } catch (error) {
                    // console.error('Error during registration:', error);
                    toast.error('An error occurred during updating. Please try again.');
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
        title: 'Client',
        breadCrumbItems: [
            {
                path: '/client-registration',
                label: 'Client Registration',
                active: true,
            },
        ],
    });

    useEffect(() => {
        var clientsData:any
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
        
        fetchClients();

        const fetchCountries = async () => {
            try {
                const bearerToken = secureLocalStorage.getItem('login');
                const response = await fetch(`${url.nodeapipath}/all/country`,{
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
                    countryData = data.country
                    setCountries(data.country || []);
                } else {
                    console.error('Error fetching countries:', data);
                }
            } catch (error) {
                console.error('Error during API call:', error);
            }
        };

        fetchCountries();

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
                    var phoneCode = clientDetails.client_mobile_number.split('-')
                    setValue('client_country', clientDetails.client_country);
                    await handleCountryChange(clientDetails.client_country)
                    setValue('client_phonecode', phoneCode[0]);
                    setValue('client_mobile_number', phoneCode[1]);
                    setValue('client_state', clientDetails.client_state);
                    setValue('client_city', clientDetails.client_city);
                    setValue('client_emailId', (clientDetails.client_emailId == null)? '':clientDetails.client_emailId);
                    setValue('client_gender', clientDetails.client_gender);
                    setValue('client_postaladdress', clientDetails.client_postaladdress);
                    setValue('client_aadhaar_number', (clientDetails.client_aadhaar_number == null)?'':clientDetails.client_aadhaar_number);
                    setValue('client_landmark', (clientDetails.client_landmark == null)? '':clientDetails.client_landmark);
                    setValue('client_sip_refrence_level', (clientDetails.sip_reference_level == undefined)?0:clientDetails.sip_reference_level);
                    await fetchClients();
                    if(clientDetails.sip_refered_by_clientId != null)
                    {
                        var clientname = await clientsData.filter((item:any)=> item._id == clientDetails.sip_refered_by_clientId)
                        setSingleSelections([{value:clientDetails.sip_refered_by_clientId,label:`${clientname[0].client_id}-${clientname[0].client_name}`}]) 
                        setValue('client_refered_by',clientDetails.sip_refered_by_clientId) 
                    }
                    
                    setValue('client_status',clientDetails.client_status.toString())
                    setValue('client_bank_name', (clientDetails.client_bank_name == undefined)?'':clientDetails.client_bank_name);
                    setValue('client_bank_account_no', (clientDetails.client_bank_account_no == undefined)?'':clientDetails.client_bank_account_no);
                    setValue('client_bank_ifsc', (clientDetails.client_bank_ifsc == undefined)?'':clientDetails.client_bank_ifsc);
                    setValue('client_others', (clientDetails.client_others == undefined)?'':clientDetails.client_others);
                    setValue('client_sip_refrence_family',clientDetails.client_sip_refrence_family)
                    setClientBranch(clientDetails.branch_id);
                    setClientsName((clientDetails.sip_refered_by_clientId == null)? '':clientDetails.sip_refered_by_clientId)


                } else {
                    console.error('Error fetching client details:', data);
                }
            } catch (error) {
                console.error('Error during API call:', error);
            }
        };

        fetchClientDetails();
    }, []);

    const handleClientChange = (e:any)=>{
        // var clientname = clients.filter((item)=> item._id == e.target.value)
        
        // setClientsName(e.target.value);

        setSingleSelections(e)
        if(e.length>0)
        {
            var clientname = clients.filter((item)=> item._id == e[0].value)
            setClientName(clientname[0].client_name);
            setValue('client_refered_by',e[0].value);
        }
        else
        {
            setClientName('');
            setValue('client_refered_by','');

        }
    }

    const handleCountryChange = async (country:any)=>{

        if(country != '')
        {
            try {
                const bearerToken = secureLocalStorage.getItem('login');
                const response = await fetch(`${url.nodeapipath}/all/state/${country}`,{
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
                    setStates(data.states || []);
                } else {
                    console.error('Error fetching states:', data);
                }
                var phoneCode = ((countryData != undefined)?countryData:countries).filter((item:any)=> item.country_name === country);

                setValue('client_phonecode',phoneCode[0].country_phonecode)

                setPhoneNumberLength(phoneCode[0].phonenumber_length)
                setValue('client_mobile_number','')
            } catch (error) {
                console.error('Error during API call:', error);
            }
        }
        else
        {
            setValue('client_phonecode','');
            setStates([]);

        }
        
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

    const handelMobileNoChange = (mobile:any)=>{ 
        if(mobile != '')
        {  
            if(mobile.length != phoneNumberLength)
            {
                setPhoneNumberValidation(false)
            }
            else
            {
                setPhoneNumberValidation(true)
            }
        }
        else
        {
            setPhoneNumberValidation(true)
        }
    }

    return (
        <Card style={{marginTop:'25px'}}>
            <Card.Body>
                <div className='d-flex'>
                    <div>
                        <h4 className="header-title mt-0 mb-1">Edit Client</h4>
                        <p className="sub-header">Modify the client details below.</p>
                    </div>
                    <div className="text-md-end mb-0" style={{width:'83.7%'}}>
                        <Button variant="dark" type="reset" onClick={()=>{navigate('/clients')}}>
                            Back
                        </Button>
                    </div>
                </div>
                <Form onSubmit={(e)=>{
                    handleSubmit(onSubmit)(e);}}>
                    <Row>
                        <Col md={6}>
                            {/* Client Id */}
                            <Form.Group className="mb-3">
                                <Form.Label> Client Id</Form.Label>
                                <Controller
                                    name="client_id"
                                    control={control}
                                    render={({ field }) => <Form.Control {...field} value={field.value || ""} 
                                    placeholder="Enter Elient Id" disabled={true}/>}
                                />
                            </Form.Group>
                            {/* Date Of Birth */}
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
                                            value={field.value ?? ""}
                                            isInvalid={!!errors.client_dob}
                                        />
                                    )}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.client_dob?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                            {/* Landmark */}
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
                                            value={field.value ?? ""}
                                            isInvalid={!!errors.client_landmark}
                                        />
                                    )}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.client_landmark?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                            {/* State */}
                            <Form.Group className="mb-3">
                                <Form.Label>State</Form.Label>
                                <Controller
                                    name="client_state"
                                    control={control}
                                    render={({ field }) => 
                                        <Form.Select
                                            {...field}
                                            value={field.value || ''}
                                            isInvalid={!!errors.client_state}>
                                            <option value="">Select State</option>
                                            {states.map((state) => (
                                                <option key={state.state_name} value={state.state_name}>
                                                    {state.state_name} - {state.state_code}
                                                        </option>
                                            ))}
                                        </Form.Select>
                                    }
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.client_state?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                            {/* Mobile No */}
                            <Form.Group className="mb-3">
                                <Form.Label>Mobile Number</Form.Label>
                                <div className='d-flex'>
                                    <div style={{width:'10%'}}>
                                    <Controller
                                        name="client_phonecode"
                                        control={control}
                                        render={({ field }) => <Form.Control {...field}  placeholder="code" disabled isInvalid={!!errors.client_phonecode} />}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.client_phonecode?.message}
                                    </Form.Control.Feedback>
                                    </div>
                                    <div style={{width:'90%'}}>
                                    <Controller
                                        name="client_mobile_number"
                                        control={control}
                                        render={({ field }) => (
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter your mobile number"
                                                {...field}
                                                isInvalid={!!errors.client_mobile_number || !phoneNumberValidation}
                                                onChange={(e)=>{field.onChange(e.target.value); handelMobileNoChange(e.target.value)}}
                                            />
                                        )}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.client_mobile_number?.message}
                                        {!phoneNumberValidation?`Please Enter ${phoneNumberLength} digit mobile number`:''}
                                    </Form.Control.Feedback>
                                    </div>
                                </div>
                                
                            </Form.Group>
                            {/* Gender */}
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
                            {/* Aadhaar Upload */}
                            <Form.Group className="mb-3">
                                <Form.Label>Aadhar Card Upload</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={(event) => handleFileChange(event as React.ChangeEvent<HTMLInputElement>,'client_addharcard')}
                                />
                            </Form.Group>
                            {/* Other Upload */}
                            <Form.Group className="mb-3">
                                <Form.Label>Other Docs Upload</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={(event) => handleFileChange(event as React.ChangeEvent<HTMLInputElement>,'client_otherdocs')}
                                />
                            </Form.Group>
                            {/* bank account no */}
                            <Form.Group className="mb-3">
                                    <Form.Label>Bank Account No</Form.Label>
                                    <Controller
                                         name="client_bank_account_no"
                                        control={control}
                                        render={({ field }) => (
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter a Bank Account No"
                                                {...field}
                                            />
                                        )}
                                    />
                            </Form.Group>
                            {/* Reference Level */}
                            <Form.Group className="mb-3">
                                <Form.Label>SIP Refrence Level</Form.Label>
                                <Controller
                                    name="client_sip_refrence_level"
                                    control={control}
                                    defaultValue={0}
                                    render={({ field }) => (
                                        <Form.Control
                                            type="number"
                                            placeholder="0"
                                            {...field}
                                            disabled = {true}
                                            isInvalid={!!errors.client_sip_refrence_level}
                                        />
                                    )}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.client_sip_refrence_level?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                            {/*Is Refered By family*/}
                            <Form.Group className="mb-3">
                                <Form.Label>Is Referred By Family</Form.Label>
                                <Controller
                                    name="client_sip_refrence_family"
                                    control={control}
                                    defaultValue={false}
                                    render={({ field }) => {
                                        const { value, ...fieldProps } = field; // Remove `value` to prevent type errors
                                        return (
                                        <Form.Check
                                            type="checkbox"
                                            // label="Referred by family?"
                                            {...fieldProps} // Spread remaining field properties (without `value`)
                                            checked={field.value} // Ensure correct boolean binding
                                            onChange={(e) => field.onChange(e.target.checked)} // Convert event value to boolean
                                        />
                                        );
                                    }}
                                />
                                {/* <Form.Control.Feedback type="invalid">
                                    {errors.client_sip_refrence_level?.message}
                                </Form.Control.Feedback> */}
                            </Form.Group>
                            {/* Branch Name */}
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

                         <Col md={6}>
                            {/* Name */}
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
                                            value={field.value || ""}
                                            isInvalid={!!errors.client_name}
                                        />
                                    )}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.client_name?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                            {/* Postal address */}
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
                                            value={field.value ?? ""}
                                            isInvalid={!!errors.client_postaladdress}
                                        />
                                    )}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.client_postaladdress?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                            {/* Country */}
                            <Form.Group className="mb-3">
                                <Form.Label>Country</Form.Label>
                                <Controller
                                    name="client_country"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Select
                                            {...field}
                                            value={field.value || ''}
                                            onChange={(e) => {field.onChange(e); handleCountryChange(e.target.value)}} 
                                            isInvalid={!!errors.client_country}>
                                            <option value="">Select Country</option>
                                            {countries.map((country) => (
                                                <option key={country.country_name} value={country.country_name}>
                                                    {country.country_name} - {country.country_code}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    )}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.client_country?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                            {/* city */}
                            <Form.Group className="mb-3">
                                <Form.Label>City/Village</Form.Label>
                                <Controller
                                    name="client_city"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter your city/village"
                                            {...field}
                                            isInvalid={!!errors.client_city}
                                        />
                                    )}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.client_city?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                            {/* Email */}
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
                                            value={field.value ?? ""}
                                            isInvalid={!!errors.client_emailId}
                                        />
                                    )}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.client_emailId?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                             {/* Aadhaar no */}
                            <Form.Group className="mb-3">
                                <Form.Label>Aadhaar Card Number</Form.Label>
                                <Controller
                                    name="client_aadhaar_number"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter your mobile number"
                                            {...field}
                                            value={field.value ?? ""}
                                            isInvalid={!!errors.client_aadhaar_number}
                                        />
                                    )}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.client_aadhaar_number?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                            {/* others dropdown */}
                            <Form.Group className="mb-3">
                                <Form.Label>Others Docs</Form.Label>
                                <Controller
                                    name="client_others"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Select
                                            {...field}
                                            value={field.value || ''}
                                            onChange={(e) => {field.onChange(e);}} 
                                            isInvalid={!!errors.client_country}>
                                            <option value="">Select Others</option>
                                            <option value="PAN">PAN</option>
                                            <option value="VOTING_CARD">VOTING CARD</option>
                                            <option value="RATION_CARD">RATION CARD</option>
                                            <option value="ELECTRICITY_BILL">ELECTRICITY BILL</option>
                                            <option value="PASSPORT">PASSPORT</option>
                                            <option value="DRIVING_LICENSE">DRIVING LICENSE</option>
                                        </Form.Select>
                                    )}
                                />                        
                            </Form.Group>
                            {/* bank name */}
                            <Form.Group className="mb-3">
                                <Form.Label>Bank Name</Form.Label>
                                    <Controller
                                    name="client_bank_name"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter a Bank Name"
                                            {...field}
                                            value={field.value ?? ""}
                                        />
                                    )}
                                />
                            </Form.Group>
                             {/* bank ifsc */}
                            <Form.Group className="mb-3">
                                <Form.Label>Bank  IFSC</Form.Label>
                                <Controller
                                    name="client_bank_ifsc"
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter a Bank IFSC"
                                            {...field}
                                            value={field.value ?? ""}
                                        />
                                    )}
                                />
                            </Form.Group>
                            {/* Referred By */}
                            <Form.Group className="mb-3">
                                <Form.Label>Referred By</Form.Label>
                                <Controller
                                    name="client_refered_by"
                                    control={control}
                                    render={({ field }) => (
                                        <Typeahead
                                            id="select-client"
                                            labelKey={'label'}
                                            {...field}
                                            multiple={false}
                                            disabled={true}
                                            onChange={(e) => { handleClientChange(e) }}
                                            options={clients.map((client) => (
                                                { value: `${client._id}`, label: `${client.client_id}-${client.client_name}` }
                                            ))}
                                            placeholder="-- Select --"
                                            selected={singleSelections} // Adjust this state to match your implementation
                                        />
                                    )}
                                />
                                
                            </Form.Group>
                            {/* <Form.Group className="mb-3">
                                 <Form.Label>Refered By</Form.Label>
                                    <select className="form-control" id="client_refered_by" value={clientsName ?? ""} onChange={(e)=>{handleClientChange(e)}} >
                                                            <option value="">-- Select --</option>
                    
                                        {clients.map((client) => (
                                        <option key={client._id} value={client._id}>
                                        {`${client.client_id}-${client.client_name}`}
                                            </option>
                                        ))}
                                    </select>
                            </Form.Group> */}
                            {/* Status */}
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
