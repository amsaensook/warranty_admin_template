import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Table,
  Tag,
  Space,
  Dropdown,
  Button,
  Menu,
  Row,
  Col,
  Input,
  Modal,
  Form,
  Select,
  message,
  DatePicker,
  Popconfirm,
  Card,
  InputNumber,
  Switch,
} from "antd";
import {
  DownOutlined,
  FundViewOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  QrcodeOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useReprintQrCode } from "../../hooks/useReprint";
import { selectAuth } from "../../contexts/slices/authSlice";
import "./Reprint.css";
import QRCode from "react-qr-code";

const Reprint: React.FC<any> = ({ MenuId, Menu_Index }) => {
  const { authResult } = useSelector(selectAuth);


  const [loading, setLoading] = useState(false);
  const [formQrCode] = Form.useForm();
  const { Option } = Select;
  const [dataQrCode, setDataQrCode] = useState<any>([]);
  const [dataQrCodePreview, setDataQrCodePreview] = useState<any>('[{"QR_NO":"","Tag_ID":0,"Item_ID":0}]');

  const [hiddenDivQrCode, setHiddenDivQrCode] = useState(true);
  

  const gridStyle: React.CSSProperties = {
    width: "50%",
    height: "100%",
    paddingTop: "20px",
    paddingLeft: "5px",
    paddingRight: "5px",
    boxShadow: "1px 1px 1px #fff",
  };
  

  const {
    isLoading: createIsLoadingQrCode,
    isError: createIsErrorQrCode,
    data: QrCode,
    error: createErrorQrCode,
    status: getStatusQrCode,
    mutate: getQrCode,
  } = useReprintQrCode();




  useEffect(() => {
    if (getStatusQrCode === "success") {
      setDataQrCode(QrCode?.data.data || []);

      if(QrCode?.data.data == undefined){
        Modal.error({
          title: "Message",
          content: `Search QR Code not found!`,
        });
        setHiddenDivQrCode(true);
      }else{
        setHiddenDivQrCode(false);
        const Arr = [
          { QR_NO: QrCode?.data.data[0].QR_NO, 
            Tag_ID: QrCode?.data.data[0].Tag_ID, 
            Item_ID: QrCode?.data.data[0].Item_ID,
          },
        ];
        setDataQrCodePreview(JSON.stringify(Arr));
        formQrCode.setFieldsValue({
          ITEM_CODE: QrCode?.data.data[0].ITEM_CODE || null,
          ITEM_DES: QrCode?.data.data[0].ITEM_DESCRIPTION || null,
          Lot_No: 'Lot No : ' + QrCode?.data.data[0].Lot_No || null,
          QR: 'QR Code : ' + QrCode?.data.data[0].QR_NO || null,
          Date:'Date : ' + QrCode?.data.data[0].Date_Job || null,
          Payer:'ผู้จ่าย : ' + QrCode?.data.data[0].Request_By || ' ',
          Receiver:'ผู้รับ : ' + QrCode?.data.data[0].Receive_By || ' ',
        });

        setTimeout(() => {
          localStorage.setItem("qr", JSON.stringify(QrCode?.data.data[0]));

          window.open(
            `${import.meta.env.VITE_APP_PUBLIC_URL}${"/QrCodePrint"}`
          );
        }, 500)
        
      }
      
    }
  }, [getStatusQrCode]);


  const handleCancel = () => {
    formQrCode.resetFields();
    setHiddenDivQrCode(true);
  };


  const handleOk = (value: any) => {
    let str = "WHERE ";
    if (value.QR_Code != undefined && value.QR_Code != '') {
      str += "QR_NO = '" + value.QR_Code+"'";
      getQrCode(str);
    }
    
  };



  return (
    <>
      <Space
        className="w-[100%]"
        direction="vertical"
        style={{ marginTop: -10 }}
      >
        <div>
          <Form
            layout="vertical"
            form={formQrCode}
            name="formQrCode"
            onFinish={handleOk}
          >
            <Space
              direction="vertical"
              size="middle"
              style={{ display: "flex" }}
            >
              <Card>
                <Row gutter={24} style={{ marginTop: -10, marginBottom: -35 }}>
                  <Col>QR Code :</Col>
                  <Col>
                    <Form.Item 
                      name="QR_Code" 
                      label="" 
                      rules={[{ required: true, message: "Please enter QR Code" }]}>
                      <Input placeholder="Please enter QR Code"/>
                    </Form.Item>
                  </Col>
                  <Col>
                  <Button
                      key="submit"
                      type="primary"
                      className="btn-info"
                      loading={loading}
                      onClick={formQrCode.submit}
                      icon={
                        <SearchOutlined className="relative bottom-[0.2em]" />
                      }
                    >
                      Search
                    </Button>
                    &nbsp;
                    <Button
                      key="back"
                      type="primary"
                      className="btn-warning"
                      danger
                      onClick={handleCancel}
                      icon={<ClearOutlined className="relative bottom-[0.2em]" />}
                    >
                      Clear
                    </Button>
                  </Col>
                </Row>
              </Card>

              <div className="print-source print-preview" hidden={hiddenDivQrCode}>

                <Card>
                  <table>
                    <tr>
                      <td>
                        <div style={{marginLeft:20,marginTop:7}}>
                          <QRCode
                              value={dataQrCodePreview}
                              size={235}
                              style={{ height: "auto", maxWidth: "100%", width: "98%" }}
                              viewBox={`0 0 256 256`}
                            />
                        </div>
                      </td>
                      <td>
                      <Row gutter={16} style={{marginTop:10,marginBottom:-20}}>
                        <Col span={24}>
                          <Form.Item name="ITEM_CODE" label="">
                            <Input style={{ width: "500px",background: "#ffffff",border: "0px"}} readOnly />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16} style={{marginBottom:-20}}>
                        <Col span={24}>
                          <Form.Item name="ITEM_DES" label="">
                            <Input style={{ background: "#ffffff",border: "0px" }} readOnly />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16} style={{marginBottom:-20}}>
                        <Col span={24}>
                          <Form.Item name="Lot_No" label="">
                            <Input style={{ background: "#ffffff",border: "0px" }} readOnly />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16} style={{marginBottom:-20}}>
                        <Col span={24}>
                          <Form.Item name="QR" label="">
                            <Input style={{ background: "#ffffff",border: "0px" }} readOnly />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16} style={{marginBottom:-20}}>
                        <Col span={24}>
                          <Form.Item name="Date" label="">
                            <Input style={{ background: "#ffffff",border: "0px" }} readOnly />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16} style={{marginBottom:-20}}>
                        <Col span={24}>
                          <Form.Item name="Payer" label="">
                            <Input style={{ background: "#ffffff",border: "0px" }} readOnly />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16} style={{marginBottom:-20}}>
                        <Col span={24}>
                          <Form.Item name="Receiver" label="">
                            <Input style={{ background: "#ffffff",border: "0px" }} readOnly />
                          </Form.Item>
                        </Col>
                      </Row>
                      </td>
                    </tr>
                  </table>
                </Card>
                    
                
                
              
            </div>          
              
            </Space>
            
          </Form>
        </div>
      </Space>
   
    </>
  );
};

export default Reprint;
