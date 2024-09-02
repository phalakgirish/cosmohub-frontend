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
import { Document, Page, pdfjs } from 'react-pdf';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.82/pdf.worker.min.js`;

interface Payment {
    sippayment_receiptno:string;
    Sip_id:string;
    sipmember_name:string;
    sip_payment_month: string;
    sip_amount: number;
    sip_penalty_month: string;
    sip_penalty_amount: number;
    sip_payment_mode: string;
    sip_payment_refno: string;
    sip_payment_receivedBy:string;
    sip_payment_receivedDate:string;
    branch:string;
}

interface Month {
    month: string;
}

interface DataResponse {
    sipPayment: Payment[];
}



const SIPLuckyDrawDetailsReport = () => {
    const [data, setData] = useState<Payment[]>([]);
    const navigate = useNavigate();
    const [paymentDeleted, setPaymentDeleted] = useState(false);
    const StorageuserData:any = secureLocalStorage.getItem('userData');
    const userData:any = JSON.parse(StorageuserData);
    const [month,setMonth] = useState('');
    const [pdfData, setPdfData] = useState<string | null>(null);
    let pdfurl:string |null = null

    usePageTitle({
        title: 'Monthly SIP Payment Report',
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

    // useEffect(() => {
    //     fetchPayments();
    // }, []);

    const generatePDF = (data:any) => {
        
        const doc = new jsPDF('p', 'pt', 'a4');

        const xStart = 70;
        const yStart = 90;
        const boxWidth = 198.5;
        const boxHeight = 140;
        const gap = 10;

        const width = doc.internal.pageSize.getWidth();
        const height = doc.internal.pageSize.getHeight();
        

        // Define the number of rows and columns
        const rows = 4;
        const cols = 2;

        // Calculate the width and height of each part
        const partWidth = width / cols;
        const partHeight = height / rows;

        // Draw lines to divide the page into 8 parts
        // for (let i = 1; i < cols; i++) {
        //     doc.line(i * partWidth, 0, i * partWidth, height);
        // }
        // for (let i = 1; i < rows; i++) {
        //     doc.line(0, i * partHeight, width, i * partHeight);
        // }
        
        // Add your content here
        // doc.text("Hello World!", 20, 20);
        let y = yStart;
        doc.setFont("helvetica", "bold");
        data.forEach((record:any, index:any) => {
            const x = xStart + (index % 2) * (partWidth);
             y = yStart + Math.floor(index / 2) * (partHeight);

            // if (y + partHeight > height) { // Check if space left on page is enough for the box
            //     doc.addPage();
            //     // y = yStart+ Math.floor(index / 2) * (partHeight); // Reset y to start position
            //   }

            if (y > height) { // Check if space left on page is enough for the box
                doc.addPage();

                y = yStart; // Reset y to start position
              }
      
            doc.setFontSize(14);

            // Calculate text width and position for centering
            const nameStatusText = `${record.Sip_id}, ${record.sipmember_name}`;
            const nameStatusTextWidth = doc.getTextWidth(nameStatusText);
            const nameStatusX = x + (partWidth - nameStatusTextWidth) / 2;
            
            const branchText = record.branch;
            const branchTextWidth = doc.getTextWidth(branchText);
            const branchX = x + (partWidth - branchTextWidth) / 2;
            
            const amountText = `${record.sip_amount}  &  ${record.sip_payment_mode}`;
            const amountTextWidth = doc.getTextWidth(amountText);
            const amountX = x + (partWidth - amountTextWidth) / 2;
            
            doc.text(nameStatusText, nameStatusX-70, y);
            doc.text(branchText, branchX-70, y + 20);
            doc.text(amountText, amountX-70, y + 40);
            doc.rect(x-70, y-90, partWidth, partHeight);
      
            // if ((index + 1) % 8 === 0) {
            //   doc.addPage();
            //   y = yStart;
            // }
          });
        
        // Save the generated PDF as a blob and set it to state
        doc.save(`Lucky Draw Details - ${formatMonthDate(month)}.pdf`)
        const pdfBlob = doc.output('blob');
        // console.log(pdfBlob);
        pdfurl = URL.createObjectURL(pdfBlob)
        setPdfData(URL.createObjectURL(pdfBlob));
      };
    
        const fetchPayments = async () => {
            try {
                const bearerToken = secureLocalStorage.getItem('login');
                const response = await fetch(`${url.nodeapipath}/report/payment?branchId=${userData.staff_branch}&month=${month}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': `Bearer ${bearerToken}`,
                    },
                });
                const data: DataResponse = await response.json();
                // console.log(data)
                
                if (response.ok) {
                    const formattedData = data.sipPayment.map((payment, index) => ({
                        srNo: index + 1,
                        sippayment_receiptno:payment.sippayment_receiptno,
                        Sip_id:payment.Sip_id,
                        sipmember_name:payment.sipmember_name,
                        sip_amount: payment.sip_amount,
                        sip_payment_month: formatMonthDate(payment.sip_payment_month),
                        sip_penalty_amount: payment.sip_penalty_amount,
                        sip_penalty_month: formatMonthDate(payment.sip_penalty_month),
                        sip_payment_mode: payment.sip_payment_mode,
                        sip_payment_refno: payment.sip_payment_refno,
                        sip_payment_receivedBy:payment.sip_payment_receivedBy,
                        sip_payment_receivedDate:formatDate(new Date(payment.sip_payment_receivedDate)),
                        branch:payment.branch
                    }));
                    setData(formattedData);
                    if(data.sipPayment.length == 0)
                    {
                        setPdfData(null)
                        return;
                    } 
                    generatePDF(formattedData)
                    
                } else {
                    console.error('Error fetching payments:', data);
                }
            } catch (error) {
                console.error('Error during API call:', error);
            }
        };

        const handleSearchPayment = ()=>{
            fetchPayments();
        }
        const handleExportPayment = ()=>{
            if(data.length == 0)
                return;
            exportToExcel(columns,Excelcolumns,data,`Monthly Payment Report-${(month == '')?'All':formatMonthDate(month)}.xlsx`)
        }

    const sizePerPageList = [
        { text: '5', value: 5 },
        { text: '10', value: 10 },
        { text: '25', value: 25 },
        { text: 'All', value: data.length },
    ];

    const Excelcolumns = ['Sr. No','Reciept No.','SIP Id','Member Name','Amount','Month','Penalty Amount','Penalty Month','Payment Mode','Received By','Received Date'];

    const columns = [
        {
            Header: 'Sr. No',
            accessor: 'srNo',
            sort: true,
        },
        {
            Header: 'Reciept No.',
            accessor: 'sippayment_receiptno',
            sort: true,
        },
        {
            Header: 'SIP Id',
            accessor: 'Sip_id',
            sort: true,
        },
        {
            Header: 'Member Name',
            accessor: 'sipmember_name',
            sort: true,
        },
        {
            Header: 'Amount',
            accessor: 'sip_amount',
            sort: true,
        },
        {
            Header: 'Month',
            accessor: 'sip_payment_month',
            sort: true,
        },
        {
            Header: 'Penalty Amount',
            accessor: 'sip_penalty_amount',
            sort: true,
        },
        {
            Header: 'Penalty Month',
            accessor: 'sip_penalty_month',
            sort: true,
        },
        {
            Header: 'Payment Mode',
            accessor: 'sip_payment_mode',
            sort: true,
        },
        {
            Header: 'Received By',
            accessor: 'sip_payment_receivedBy',
            sort: true,
        },
        {
            Header: 'Received Date',
            accessor: 'sip_payment_receivedDate',
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
                                <h4 className="header-title">Monthly SIP Payment Report</h4>
                                <p className="text-muted font-14">A table showing monthly payment report</p>
                            </div>
                        </div>
                        <hr />
                        <div className="mb-1">
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-2 d-flex">
                                                <Form.Label style={{width:'15%'}}>Month</Form.Label>
                                                 <input type="month" className="form-control" placeholder="Select Month" onChange={(e)=>{setMonth(e.target.value)}}/>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} style={{ textAlign:'end' }}>
                                        <Button style={{ height: '40px', backgroundColor: '#dd4923'}} onClick={handleSearchPayment}>
                                                Search
                                        </Button>
                                    </Col>
                                </Row>
                        </div>
                        <hr />
                        {/* <Table
                            columns={columns}
                            data={data}
                            pageSize={5}
                            sizePerPageList={sizePerPageList}
                            isSortable={true}
                            pagination={true}
                            // isSearchable={true}
                        /> */}

                    {(pdfData)? (
                            

                        //  <Worker workerUrl={pdfjs.GlobalWorkerOptions.workerSrc}>
                        //     <Viewer fileUrl='http://localhost:3000/ed85d4ed-7ebc-4248-ab01-df90dc592587' />
                        // </Worker>
                        <iframe
                            src={pdfData}
                            style={{ width: '100%', height: '100vh' }}
                            frameBorder="0"
                            ></iframe>
                 ):'No Data Found'} 
                    </Card.Body>
                </Card>
            </Col>
            <ToastContainer/>
        </Row>
    );
};

export default SIPLuckyDrawDetailsReport;
