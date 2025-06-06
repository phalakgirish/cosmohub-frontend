import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, FormText } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '../../hooks';
import url from '../../env';
import Table from '../../components/Table';
import secureLocalStorage from 'react-secure-storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Controller, useForm } from 'react-hook-form';
import * as XLSX from 'xlsx';
import { AnyIfEmpty } from 'react-redux';

interface Payment {
    sipmember_id: string,
    client_id: string,
    sipmember_name: string,
    sipmember_doj: string,
    sipmember_maturity_date: string,
    Sip_month:string;
    totalSIPAmount: number,
    totalSIPPenaltyAmount: number
}

interface Month {
    month: string;
}

interface DataResponse {
    sipMemberDetails: Payment[];
}

const ExpiringClientScheme = () => {
    const [data, setData] = useState<any>([]);
    const navigate = useNavigate();
    const [paymentDeleted, setPaymentDeleted] = useState(false);
    const StorageuserData:any = secureLocalStorage.getItem('userData');
    const userData:any = JSON.parse(StorageuserData);
    const [month,setMonth] = useState('');

    usePageTitle({
        title: 'List of Expiring Client Scheme in 1 month',
        breadCrumbItems: [
            {
                path: '/payments',
                label: 'Payments',
                active: true,
            },
        ],
    });

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
    }
    const formatMonthDate = (dateString:any)=> {
        // console.log(dateString);
        
        if(dateString == '')
            return '';
        const [year, month] = dateString.split('-');
        
        // Create a date object using the year and month
        const date = new Date(`${year}-${month}-01`);
        
        // Format the month to get the full month name
        const options = { month: "long" };
        const monthName = new Intl.DateTimeFormat('en-US',{ month: 'long' }).format(date);
        
        return `${monthName}-${year}`;
    }

    

    useEffect(()=>{
        const bearerToken = secureLocalStorage.getItem('login');
        const fetchDashboard = async()=>{
            try {
                const response = await fetch(`${url.nodeapipath}/report/expiring-scheme`,{
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
                        console.log(data);

                        const formattedData = data.referenceSchemepayment_dts.map((payment:any, index:any) => ({
                            srNo: index + 1,
                            client_id:payment.client_id,
                            client_name:payment.client_name,
                            reference_scheme:payment.reference_scheme,
                            reference_category:payment.reference_category,
                            ref_payment_expirationDate: formatDate(new Date(payment.ref_payment_expirationDate)),
                        }));

                        setData(formattedData);

                        
                } else {
                    console.error('Error fetching branches:', data);
                }
            } catch (error) {
                console.error('Error during API call:', error);
            }
        }
        fetchDashboard()
    },[])
    
        const handleExportPayment = ()=>{
            if(data.length == 0)
                return;
            exportToExcel(columns,Excelcolumns,data,`Expiring Client Scheme Report.xlsx`)
        }

    const sizePerPageList = [
        { text: '5', value: 5 },
        { text: '10', value: 10 },
        { text: '25', value: 25 },
        { text: 'All', value: data.length },
    ];

    const Excelcolumns = ['Sr. No','Client Id','Client Name','reference Scheme','Reference Category','Expiration Date'];

    const columns = [
        {
            Header: 'Sr. No',
            accessor: 'srNo',
            sort: true,
        },
        {
            Header: 'Client Id',
            accessor: 'client_id',
            sort: true,
        },
        {
            Header: 'Client Name',
            accessor: 'client_name',
            sort: true,
        },
        {
            Header: 'Reference Scheme',
            accessor: 'reference_scheme',
            sort: true,
        },
        {
            Header: 'Reference Category',
            accessor: 'reference_category',
            sort: true,
        },
        {
            Header: 'Expiration Date',
            accessor: 'ref_payment_expirationDate',
            sort: true,
        },
    ];


    const exportToExcel = (columns:any,columnHeader:any, data:any, fileName:any) => {
        // console.log(data);
        
        // Create a new workbook
        const workbook = XLSX.utils.book_new();
    
        // Map the data to an array of objects with the specified column names
        const worksheetData = data.map((item:any) =>
            columns.reduce((acc:any, column:any) => {
                acc[column.Header] = item[column.accessor];
                return acc;
            }, {})
        );

        console.log();
        
    
        // Convert the data to a worksheet
        const worksheet = XLSX.utils.json_to_sheet(worksheetData, { header: columnHeader });
    
        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
        // Generate Excel file and download it
        XLSX.writeFile(workbook, fileName);
    };

    return (
        <Row style={{ marginTop: '25px' }}>
            <Col>
                <Card>
                    <Card.Body>
                        <div className="d-flex justify-content-between">
                            <div>
                                <h4 className="header-title">Expiring Client Scheme Report</h4>
                                <p className="text-muted font-14">A table showing list of expiring client scheme in 1 month</p>
                            </div>
                        </div>
                        <div className="mb-1">
                                <Row>
                                    <Col md={6}>
                                    </Col>
                                    <Col md={6} style={{ textAlign:'end' }}>
                                        <Button style={{ height: '40px', backgroundColor: '#05711e'}} onClick={handleExportPayment}>
                                                Export
                                        </Button>
                                    </Col>
                                </Row>
                        </div>
                        <hr />
                        <Table
                            columns={columns}
                            data={data}
                            pageSize={5}
                            sizePerPageList={sizePerPageList}
                            isSortable={true}
                            pagination={true}
                            // isSearchable={true}
                        />
                    </Card.Body>
                </Card>
            </Col>
            <ToastContainer/>
        </Row>
    );
};

export default ExpiringClientScheme;
