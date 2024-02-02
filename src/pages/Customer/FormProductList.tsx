import React, { useState, useEffect } from "react";
import {
  Button,
  Row,
  Col,
  Input,
  Modal,
  Form,
  Select,
  message,
  InputNumber,
  Tabs,
  Radio,
  Breadcrumb,
  List, 
  Steps,
  Card,
  Tag,
  Typography,
  DatePicker
} from "antd";
import {
  PrinterOutlined
} from "@ant-design/icons";
import moment from "moment";
import { 
  SaveOutlined, 
  CloseOutlined,
  DownOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { 
  useDeleteCustomer, 
  useCreateCustomer, 
  useUpdateCustomer 
} from "../../hooks/useCustomer";

import { 
  useDeleteRegisterProduct, 
  useCreateRegisterProduct, 
  useUpdateRegisterProduct 
} from "../../hooks/useRegisterProduct";

import {
  useClaim,
  useDeleteClaim, 
  useCreateClaim, 
  useUpdateClaim 
} from "../../hooks/useClaim";

import { useServiceCategories } from "../../hooks/useServiceCategories";
import { useProductType } from "../../hooks/useProductType";
import { useProvince } from "../../hooks/useProvince";
import { useDistrict } from "../../hooks/useDistrict";
import { useSubdistrict } from "../../hooks/useSubdistrict";
import { useProductListWarranty } from "../../hooks/useProductListWarranty";
const FormProductList: React.FC<any> = ({ visible, handleCloseModalProductList, customer }) => {

  const { Title } = Typography;
  const [loading, setLoading] = useState(false);

  const [visibleRegister, setVisibleRegister] = useState(false);
  const [visibleClaim, setVisibleClaim] = useState(false);
  const [hiddenList, setHiddenList] = useState(false);
  const [hiddenDes, setHiddenDes] = useState(true);

  const [formProductList] = Form.useForm();

  const [formRegister] = Form.useForm();
  const [formRegisterEdit] = Form.useForm();
  const [formClaim] = Form.useForm();
  const [formPrint] = Form.useForm();
  const { Option } = Select;
  const { TabPane } = Tabs;
  const [product, setProduct] = useState<any>([]);
  const [warrantyIndex, setWarrantyIndex] = useState<any>([]);
  const [listClaim, setListClaim] = useState<any>([]);
  const [claimIndex, setClaimIndex] = useState<any>([]);
  const [productCodeClaim, setProductCodeClaim] = useState<any>([]);
  const [hiddenDelete, setHiddenDelete] = useState(true);
  const [dateTime, setDateTime] = useState(moment().format("YYYY-MM-DD"));
  

  const {
    data: ServiceCategories,
 } = useServiceCategories();

  const {
    data: ProductList,
    status: ProductListStatus,
    error: ProductListError,
    mutate: getProductList,
  } = useProductListWarranty();

  const {
    error: createError,
    status: createStatus,
    mutate: createMutate,
  } = useCreateRegisterProduct();

  const {
    error: updateError,
    status: updateStatus,
    mutate: updateMutate,
  } = useUpdateRegisterProduct();

  const {
    error: deleteErrorRegisterProduct,
    status: deleteStatusRegisterProduct,
    mutate: deleteMutateRegisterProduct,
  } = useDeleteRegisterProduct();

  const {
    error: createErrorClaim,
    status: createStatusClaim,
    mutate: createMutateClaim,
  } = useCreateClaim();

  const {
    error: updateErrorClaim,
    status: updateStatusClaim,
    mutate: updateMutateClaim,
  } = useUpdateClaim();

  const {
    error: deleteErrorClaim,
    status: deleteStatusClaim,
    mutate: deleteMutateClaim,
  } = useDeleteClaim();

  const {
    data: ClaimList,
    status: ClaimListStatus,
    error: ClaimListError,
    mutate: getClaimList,
  } = useClaim();


  useEffect(() => {
    console.log('dddddddddddddddddzzzz',customer);
    formProductList.resetFields();

    formProductList.setFieldsValue({
      Customer_Index: customer?.Customer_ID || null,
      ID_Card_Number: customer?.ID_Card_Number || "",
      prefix: customer?.PreFix || "",
      Name_Customer: customer?.Name || "",
      Surname_Customer: customer?.Surname || "",
      Phone_Number: customer?.Phone_Number || "",
      Address: customer?.Address || "",
      Province_Name: customer?.Province || "",
      Province: customer?.Province || null,
      District_Name: customer?.District || null,
      District: customer?.District || null,
      Subdistrict_Name: customer?.Subdistrict || null,
      Subdistrict: customer?.Subdistrict || null,
      Postal_Code: customer?.Postal_Code || null,
      Link_Google_Map: customer?.Link || null,

    });


    
    if(customer?.Customer_ID != undefined){
      getProductList(customer?.Customer_ID);
    }
    

  }, [customer]);

  const showModal = () => {

    console.log('TES',customer?.Customer_ID);
    formRegister.resetFields();
    formRegister.setFieldsValue({
      Customer_ID: customer?.Customer_ID || null,

    });
    setVisibleRegister(true);

  };

  const handleAddRegister = () => {
    showModal();
    
  };

  const handleCloseModalRegister = () => {
    setVisibleRegister(false);
    formRegister.resetFields();
    setWarrantyIndex([]);
  };

  useEffect(() => {
    if (ProductListStatus === "success") {
      console.log('Hello =',ProductList?.data.data);

      setProduct(ProductList?.data.data || []);

    } else if (ProductListStatus === "error") {
      message.error(ProductListError?.response?.data?.message || ProductListError.message);
    }
  }, [ProductListStatus]);

  
  const showDivDes = (value:any) => {

    console.log('showDivDes',value);
    setHiddenList(true);
    setHiddenDes(false);

    formRegisterEdit.resetFields();
    formRegisterEdit.setFieldsValue({
        Warranty_Index: value.Warranty_Index,
        Serial_No: value.Serial_No,
        Product_Code: value.Product_Code, 
        Register_Date: moment(value.Register_Date),
        Receipt_Address: value.Receipt_Address,
        Dealer_Name: value.Dealer_Name,
        Dealer_Sales: value.Dealer_Sales,
        Date_of_Purchase: moment(value.Date_of_Purchase),
        Date_Warranty_Expires: moment(value.Date_Warranty_Expires),
      });

      setWarrantyIndex(value.Warranty_Index);
      setProductCodeClaim(value.Product_Code);
      getClaimList(value.Warranty_Index);
  };

  const hiddenDivDes = () => {
    console.log('sssssssss');
    setHiddenList(false);
    setHiddenDes(true);
    setWarrantyIndex([]);
  };


  
  


  const handleOk = (value: any) => {
    //setLoading(true);

    console.log('handleOk =',value);


    if (value?.RegisterProduct_Index) {
      updateMutate(value);
    } else {
      createMutate(value);
    }
  };

  const handleRegisterEdit = (value: any) => {
    //setLoading(true);

    console.log('xxxxx =',value);
    
    updateMutate(value);
    
  };

  const deleteProduct = () => {
setLoading(true);
    Modal.confirm({
      title: "Delete Confirm",
      content: <>{`Do you want delete Product ?`}</>,
      onOk: () => {
        deleteMutateRegisterProduct(warrantyIndex);
      },
    });


  };
       



  useEffect(() => {
    if (createStatus === "success") {
      message.success("Register Warranty Product Success");
      handleCloseModalRegister();
      setLoading(false);
      getProductList(customer?.Customer_ID);
    } else if (createStatus === "error") {
      message.error(
        createError?.response?.data?.message || createError.message
      );
      setLoading(false);
    }
  }, [createStatus]);

  useEffect(() => {
    if (updateStatus === "success") {
      message.success("Update Product Success");
      setLoading(false);
      
    } else if (updateStatus === "error") {
      message.error(
        updateError?.response?.data?.message ||
        updateError.message
      );
      setLoading(false);
    }
  }, [updateStatus]);

  useEffect(() => {
    if (deleteStatusRegisterProduct === "success") {
      message.success("Delete Product  Success");
      hiddenDivDes();
      getProductList(customer?.Customer_ID);
      setLoading(false);
    } else if (deleteStatusRegisterProduct === "error") {
      message.error(
        deleteErrorRegisterProduct ?.response?.data?.message ||
        deleteErrorRegisterProduct .message
      );
      setLoading(false);
    }
  }, [deleteStatusRegisterProduct ]);


  const showModalClaim = (value: any) => {

    console.log('dddd =',value);

    if(value == "Add"){
      console.log('if');
      setVisibleClaim(true);
      formClaim.setFieldsValue({
        Warranty_Index: warrantyIndex,
        Date_Work_Site: moment(dateTime),
        Name_Claim:customer?.Name+'  '+customer?.Surname,
        Phone_Number_Claim : customer?.Phone_Number || "",
        Product_Code:productCodeClaim,
      });
    }else{
      console.log('else');
      setVisibleClaim(true);
      setHiddenDelete(false);
      setClaimIndex(value.Claim_Index);
      formClaim.resetFields();
      formClaim.setFieldsValue({
        Claim_Index:value.Claim_Index,
        Warranty_Index: value.Warranty_Index,
        Name_Claim:value.Customer_Name,
        Phone_Number_Claim:value.Phone_Number,
        Service_Categories:value.Service_Categories,
        Product_Code:value.Product_Code,
        Defective_Product_Qty:value.Defective_Product_Qty,
        Date_Work_Site: moment(value.Date_Work_Site),
        Date_Arrive_Work_Site:moment(value.Date_Arrive_Work_Site),
        Claimant_Name:value.Claimant_Name,
        Claimant_Agency:value.Claimant_Agency,
      });
    }
    

  };

  const handleCloseModelClaim = () => {
    setVisibleClaim(false);
    setHiddenDelete(true);
    formClaim.resetFields();
   getClaimList(warrantyIndex);
  };

  useEffect(() => {
    if (ClaimListStatus === "success") {

      console.log('History =',ClaimList);
      setListClaim(ClaimList?.data.data || []);

    } else if (ClaimListStatus === "error") {
      message.error(ClaimListError?.response?.data?.message || ClaimListError.message);
    }
  }, [ClaimListStatus]);

  const handleOkClaim = (value: any) => {
    //setLoading(true);

    console.log('handleOkClaim =',value);
    

    if (value?.Claim_Index) {
      updateMutateClaim(value);
    } else {
      createMutateClaim(value);
    }
  };

  const deleteClaim = () => {
    //setLoading(true);
    Modal.confirm({
      title: "Delete Confirm",
      content: <>{`Do you want delete Claim ?`}</>,
      onOk: () => {
        deleteMutateClaim(claimIndex);
      },
    });


  };

  useEffect(() => {
    if (createStatusClaim === "success") {
      message.success("Add Claim Success");
      handleCloseModelClaim();
      setLoading(false);
      
    } else if (createStatusClaim === "error") {
      message.error(
        createErrorClaim?.response?.data?.message ||
        createErrorClaim.message
      );
      setLoading(false);
    }
  }, [createStatusClaim]);

  useEffect(() => {
    if (updateStatusClaim === "success") {
      message.success("Update Claim Success");
      handleCloseModelClaim();
      setLoading(false);
      
    } else if (updateStatusClaim === "error") {
      message.error(
        updateErrorClaim?.response?.data?.message ||
        updateErrorClaim.message
      );
      setLoading(false);
    }
  }, [updateStatusClaim]);


  useEffect(() => {
    if (deleteStatusClaim === "success") {
      message.success("Delete Claim Success");
      handleCloseModelClaim();
      setLoading(false);
      
    } else if (deleteStatusClaim === "error") {
      message.error(
        deleteErrorClaim?.response?.data?.message ||
        deleteErrorClaim.message
      );
      setLoading(false);
    }
  }, [deleteStatusClaim]);


  return (
    <>
      <Modal
        visible={visible}
        title="รายการสินค้า"
        onOk={formProductList.submit}
        onCancel={handleCloseModalProductList}
        width={1000}
        footer={[
          <Button
            key="back"
            type="ghost"
            danger
            onClick={handleCloseModalProductList}
            icon={<CloseOutlined className="relative bottom-[0.2em]" />}
          >
            Cancel
          </Button>,
        ]}
      > 
        <Button
            type="primary"
            className="btn-success"
            icon={<PlusOutlined className="relative bottom-[0.2em]" />}
            onClick={handleAddRegister}
            
          >
            เพิ่มสินค้า
        </Button>

          
          <div
           hidden={hiddenList}
           style={{marginTop:20}}
          >
          <List 
            
            grid={{ gutter: 16, column: 1 }}
            dataSource={product}
            renderItem={(item:any) => (

              <List.Item
                onClick={() => showDivDes(item)}
              >
                  <Card hoverable 
                    style={{
                      borderRadius: "20px",
                    }}>
                    <Row gutter={24}>
                      <Col span={19}>
                      <Title
                        style={{
                          fontWeight: "bold",
                          fontSize:20
                        }}
                        className="font-sans text-left"
                      >
                        {item.Serial_No}
                      </Title>
                        
                      </Col>
                      <Col span={5}>
                        <Tag color={item.Color_tag}>{item.Warranty_Expires}</Tag>
                      </Col>
                    </Row>
                    <Row gutter={24} style={{marginTop:1}}>
                      <Col span={19}>
                        <Title
                          style={{
                            fontWeight: "bold",
                            fontSize:16
                          }}
                          className="font-sans text-left"
                        >
                          {item.Product_Code}
                          </Title>
                      </Col>
                    </Row>
                    <Row gutter={24} style={{marginTop:5}}>
                      <Col span={20}>
                        <Title
                            style={{
                              fontWeight: "bold",
                              fontSize:16
                            }}
                            className="font-sans text-left"
                          >
                          Warranty expiration date : {item.Date_Warranty_Expires1}
                          </Title>
                      </Col>
                    </Row>
                  </Card>
              </List.Item>
            )}
          />
          </div>

          {/* -------------------------รายละเอียด------------------------------- */}
          <div
           hidden={hiddenDes}
           style={{marginTop:20}}
          > 
            <Tabs type="card" >

            {/* -------------------------------------------------รายละเอียดสินค้า ---------------------------------------------------------- */}

            <TabPane tab="รายละเอียดสินค้า" key="1" >
            <div className="form-register4" >
               <Row gutter={16}>
               <Col span={5}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 7,
                    marginBottom: 20,
                  }}
                  onClick={() => hiddenDivDes()}
                  ghost>
                  ย้อนกลับ
                </Button>
                </Col>
                <Col span={19}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 7,
                      marginBottom: 20,
                    }}
                    onClick={() => showModalClaim("Add")}
                    ghost>
                    แจ้งเครมสินค้า
                  </Button>
                </Col>
                </Row>
                         <Form
                  size="large"
                  form={formRegisterEdit}
                  name="formRegisterEdit"
                  onFinish={handleRegisterEdit}
                  // onFinishFailed={handleSignInFailed}
                  onReset={() => formRegisterEdit.resetFields()}
                >
                <Form.Item name="Warranty_Index" label="Warranty_Index" hidden>
                  <Input />
                </Form.Item>
                  <span>
                    หมายเลขสินค้า/Serial No
                  </span>
                  <Form.Item
                    name="Serial_No"
                    rules={[
                      {
                        required: true,
                        message: "Please enter Serial No",
                      },
                    ]}
                  >
                    <Input
                      placeholder={`  Serial No...`}
                      size="large"
                      allowClear
                    />
                  </Form.Item>
                  <Form.Item>
                  <span>
                    รหัสสินค้า/Product Code
                  </span>
                  <Form.Item
                    name="Product_Code"
                    rules={[
                      { required: true, message: "Please enter Product Code" },
                    ]}
                  >
                    <Input placeholder="Please enter Product Code" allowClear/>
                  </Form.Item>
                  <span>
                    วันที่ลงทะเบียน/Register Date
                  </span>
                  <Form.Item
                    name="Register_Date"
                    rules={[
                      {
                        required: true,
                        message: "Register Date...",
                      },
                    ]}
                  > 
                    <DatePicker className="myDatePicker w-full"  
                      size="large"
                      />
                  </Form.Item>
                  <span>
                  ที่อยู่ออกใบเสร็จ/Receipt Address
                  </span>  
                  <Form.Item
                    name="Receipt_Address"
                    rules={[
                      { required: true, message: "Please enter Receipt Address" },
                    ]}
                  >
                    <Input placeholder="Please enter Receipt Address" allowClear/>
                  </Form.Item>
                  <span>
                  ชื่อตัวแทนจำหน่าย/Dealer Name
                  </span>    
                  <Form.Item
                    name="Dealer_Name"
                    rules={[{ required: true, message: "Please enter Dealer Name" }]}
                  >
                    <Input placeholder="Please enter Dealer Name" allowClear/>
                  </Form.Item>
                  
              
                  <span>
                    ชื่อเจ้าหน้าที่ตัวแทนจำหน่าย/Dealer Sales
                  </span>     
                  <Form.Item
                    name="Dealer_Sales"
                    rules={[
                      { required: true, message: "Please enter Dealer Sales" },
                    ]}
                  >
                    <Input placeholder="Please enter Dealer Sales" allowClear/>
                  </Form.Item>
                  <span>
                    วันที่ซื้อสินค้า/Date of Purchase
                  </span>     
                  <Form.Item
                    name="Date_of_Purchase"
                  >
                    <DatePicker className="myDatePicker w-full"  
                      size="large"
                      disabled  
                      />
                  </Form.Item>
                  <span>
                    วันที่ประกันหมดอายุ
                  </span>     
                  <Form.Item
                    name="Date_Warranty_Expires"
                  >
                    <DatePicker className="myDatePicker w-full"  
                      size="large"
                      disabled
                      />
                  </Form.Item>
                    
                    
                    

                  </Form.Item>
                  <div 
                      style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 2,
                      marginBottom: 20,
                    }}>
                        <Button
                          key="submit"
                          type="primary"
                          onClick={formRegisterEdit.submit}
                          icon={<EditOutlined className="relative bottom-[0.2em]" />}
                        >
                          Edit
                        </Button>&nbsp;
                        <Button
                        key="back"
                        type="primary"
                        danger
                        onClick={deleteProduct}
                        icon={<DeleteOutlined className="relative bottom-[0.2em]" />}
                      >
                        Delete
                      </Button>

                  </div>
                  

                </Form>
                

                
              </div>
              </TabPane>

              <TabPane tab="ประวัติการเครม" key="2">
                           
              <List 
            
                  grid={{ gutter: 16, column: 1 }}
                  dataSource={listClaim}
                  renderItem={(item:any) => (

                    <List.Item
                    onClick={() => showModalClaim(item)}
                    >
                      
                        <Card hoverable 
                          style={{
                            borderRadius: "20px",
                          }}>
                          <Row gutter={24}>
                            <Col span={19}>
                            <Title
                              style={{
                                fontWeight: "bold",
                                fontSize:15
                              }}
                              className="font-sans text-left"
                            >
                              {item.Product_Code}
                            </Title>
                              
                            </Col>
                            <Col span={5}>
                              <Tag color="#87d068">Active</Tag>
                            </Col>
                          </Row>
                          <Row gutter={24} style={{marginTop:1}}>
                            <Col span={19}>
                              {item.Customer_Name}
                            </Col>
                          </Row>
                          <Row gutter={24} style={{marginTop:5}}>
                            <Col span={20}>
                              {item.Date_Work_Site}
                            </Col>
                          </Row>
                        </Card>
                    </List.Item>
                  )}
                />
                </TabPane> 
              </Tabs>

          </div>
      </Modal>




      <Modal
        visible={visibleRegister}
        title="ลงทะเบียนประกันสินค้า"
        onOk={formRegister.submit}
        onCancel={handleCloseModalRegister}
        width={750}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={formRegister.submit}
            icon={<SaveOutlined className="relative bottom-[0.2em]" />}
          >
            Submit
          </Button>,
          <Button
            key="back"
            type="ghost"
            danger
            onClick={handleCloseModalRegister}
            icon={<CloseOutlined className="relative bottom-[0.2em]" />}
          >
            Cancel
          </Button>,
        ]}
      > 
          <Form
          layout="vertical"
          form={formRegister}
          name="formRegister"
          onFinish={handleOk}
        >

                <Form.Item name="RegisterProduct_Index" label="RegisterProduct Index" hidden>
                  <Input />
                </Form.Item>

                <Form.Item name="Customer_ID" label="Customer_ID" hidden>
                  <Input />
                </Form.Item>
                  <span>
                    หมายเลขสินค้า/Serial No
                  </span>
                  <Form.Item
                    name="Serial_No"
                    rules={[
                      {
                        required: true,
                        message: "Please enter Serial No",
                      },
                    ]}
                  >
                    <Input
                      placeholder={`  Serial No...`}
                      size="large"
                      allowClear
                    />
                  </Form.Item>
                  <span>
                    รหัสสินค้า/Product Code
                  </span>
                  <Form.Item
                    name="Product_Code"
                    rules={[
                      { required: true, message: "Please enter Product Code" },
                    ]}
                  >
                    <Input placeholder="Please enter Product Code" />
                  </Form.Item>
                  <span>
                    วันที่ลงทะเบียน/Register Date
                  </span>
                  <Form.Item
                    name="Register_Date"
                    rules={[
                      {
                        required: true,
                        message: "Register Date...",
                      },
                    ]}
                  > 
                    <DatePicker className="myDatePicker w-full"  
                      size="large"
                      />
                  </Form.Item>
                  <span>
                  ที่อยู่ออกใบเสร็จ/Receipt Address
                  </span>  
                  <Form.Item
                    name="Receipt_Address"
                    rules={[
                      { required: true, message: "Please enter Receipt Address" },
                    ]}
                  >
                    <Input placeholder="Please enter Receipt Address" />
                  </Form.Item>
                  <span>
                  ชื่อตัวแทนจำหน่าย/Dealer Name
                  </span>    
                  <Form.Item
                    name="Dealer_Name"
                    rules={[{ required: true, message: "Please enter Dealer Name" }]}
                  >
                    <Input placeholder="Please enter Dealer Name" />
                  </Form.Item>
                  
              
                  <span>
                    ชื่อเจ้าหน้าที่ตัวแทนจำหน่าย/Dealer Sales
                  </span>     
                  <Form.Item
                    name="Dealer_Sales"
                    rules={[
                      { required: true, message: "Please enter Dealer Sales" },
                    ]}
                  >
                    <Input placeholder="Please enter Dealer Sales"/>
                  </Form.Item>
                  <span>
                    วันที่ซื้อสินค้า/Date of Purchase
                  </span>     
                  <Form.Item
                    name="Date_of_Purchase"
                  >
                    <DatePicker className="myDatePicker w-full"  
                      size="large"/>
                  </Form.Item>
              
            </Form>
         
        
      </Modal>


      {/* ---------------------------------------Claim--------------------------------------------- */}
      <Modal
              visible={visibleClaim}
              title="แจ้งเครม"
              style={{ top: 20 }}
              onCancel={handleCloseModelClaim}
              width={750}
              
              footer={[
                <Button
                  key="submit"
                  type="primary"
                  loading={loading}
                  onClick={formClaim.submit}
                  icon={<SaveOutlined className="relative bottom-[0.2em]" />}
                >
                  Submit
                </Button>,
                <Button
                key="back"
                type="primary"
                danger
                onClick={deleteClaim}
                icon={<DeleteOutlined className="relative bottom-[0.2em]" />}
                hidden={hiddenDelete}
              >
                Delete
              </Button>,

                <Button
                  key="back"
                  type="ghost"
                  danger
                  onClick={handleCloseModelClaim}
                  icon={<CloseOutlined className="relative bottom-[0.2em]" />}
                >
                  Cancel
                </Button>,
              ]}
            >
              <Form 
              layout="vertical" 
              form={formClaim} 
              name="formClaim"
              onFinish={handleOkClaim}>
              <Form.Item name="Claim_Index" label="Claim Index" hidden>
                  <Input />
                </Form.Item>
                <Form.Item name="Warranty_Index" label="Warranty_Index" hidden>
                  <Input />
                </Form.Item>
                  <span>
                    ชื่อลูกค้า/Name
                  </span>
                  <Form.Item
                    name="Name_Claim"
                    rules={[
                      {
                        required: true,
                        message: "Please enter Name",
                      },
                    ]}
                  >
                    <Input
                      placeholder={`  Name...`}
                      size="large"
                      allowClear
                      
                    />
                  </Form.Item>

                  <span>
                    เบอร์โทรศัพท์/Phone Number
                  </span>
                  <Form.Item
                    name="Phone_Number_Claim"
                    rules={[
                      {
                        required: true,
                        message: "Phone_Number...",
                      },
                    ]}
                  > 
                    <Input placeholder="Please enter Phone Number" allowClear/>
                  </Form.Item>
                  <span>
                  ประเภทการบริการ/Service Categories
                  </span>  
                  <Form.Item
                      name="Service_Categories"
                      label=""
                      rules={[
                        {
                          required: true,
                          message: "Please choose Service Categories",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Please choose Service Categories"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          (option!.children as unknown as string)
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      >
                        {ServiceCategories?.data?.data?.map((value: any) => {
                          return (
                            <Option key={value.Service_Categories_Index} value={value.Description}>
                              {value.Description}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  <span>
                  รหัสสินค้า/Product Code
                  </span>  
                  <Form.Item
                    name="Product_Code"
                    rules={[
                      { required: true, message: "Please enter Product Code" },
                    ]}
                  >
                    <Input placeholder="Please enter Product Code" allowClear/>
                  </Form.Item>  
                  <span>
                  จำนวนที่เกิดปัญหา
                  </span>    
                  <Form.Item
                    name="Defective_Product_Qty"
                    rules={[{ required: true, message: "Please enter Defective Product Qty" }]}
                  >
                    <InputNumber style={{ width: "100%" }}
                        step="1"
                        min={1}
                        max={100000} 
                        placeholder="Please enter Defective Product Qty" />
                  </Form.Item>
                  <span>
                    วันที่แจ้งงาน
                  </span>     
                  <Form.Item
                    name="Date_Work_Site"
                  >
                    <DatePicker className="myDatePicker w-full"  
                      size="large"
                      />
                  </Form.Item>

                  <span>
                  วันที่ต้องการให้เข้าหน้างาน
                  </span>     
                  <Form.Item
                    name="Date_Arrive_Work_Site"
                  >
                    <DatePicker className="myDatePicker w-full"  
                      size="large"
                      />
                  </Form.Item>
              
                  <span>
                   ชื่อผู้แจ้ง
                  </span>     
                  <Form.Item
                    name="Claimant_Name"
                    rules={[
                      { required: true, message: "Please enter Claimant Name" },
                    ]}
                  >
                    <Input placeholder="Please enter Claimant Name" allowClear/>
                  </Form.Item>
                  <span>
                  หน่วยงานผู้แจ้ง
                  </span>     
                  <Form.Item
                    name="Claimant_Agency"
                    rules={[
                      { required: true, message: "Please enter Claimant Agency" },
                    ]}
                  >
                    <Input placeholder="Please enter Claimant Agency" allowClear/>
                  </Form.Item>
              </Form>
            </Modal>


    </> 
  );
};

export default FormProductList;
