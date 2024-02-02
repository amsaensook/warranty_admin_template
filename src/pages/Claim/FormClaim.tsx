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
  Space,
  DatePicker,
} from "antd";
import type { RadioChangeEvent,UploadProps} from 'antd';
import {
  PrinterOutlined
} from "@ant-design/icons";
import moment from "moment";
import { 
  SaveOutlined, 
  CloseOutlined 
} from "@ant-design/icons";
import { 
  useDeleteProject, 
  useCreateProject, 
  useUpdateProject 
} from "../../hooks/useProject";
import { useProductType } from "../../hooks/useProductType";
import { useProvince } from "../../hooks/useProvince";
import { useDistrict } from "../../hooks/useDistrict";
import { useSubdistrict } from "../../hooks/useSubdistrict";
const FormClaim: React.FC<any> = ({ visible, handleCloseModal, Claim }) => {

  const [loading, setLoading] = useState(false);
  const [hiddenPrint, setHiddenPrint] = useState(false);
  const [dataSourcePrint, setDataSourcePrint] = useState<any>([]);
  const [districtList, setDistrictList] = useState<any>([]);
  const [subdistrictList, setSubdistrictList] = useState<any>([]);
  const [dateTime, setDateTime] = useState(moment().format("YYYY-MM-DD"));
  const [dateTimeEnd, setDateTimeEnd] = useState(moment().format("YYYY-MM-DD"));

  const [FormClaim] = Form.useForm();
  const [formPrint] = Form.useForm();
  const { Option } = Select;
  

  const {
    error: createError,
    status: createStatus,
    mutate: createMutate,
  } = useCreateProject();

  const {
    error: updateError,
    status: updateStatus,
    mutate: updateMutate,
  } = useUpdateProject();

  const {
    data: ProductType,
  } = useProductType();


  const {
    data: Province,
  } = useProvince();

  const {
    isLoading: DistrictIsLoading,
    isError: DistrictIsError,
    data: District,
    status: DistrictStatus,
    error: DistrictError,
    mutate: getDistrict,
  } = useDistrict();

  const {
    isLoading: SubdistrictIsLoading,
    isError: SubdistrictIsError,
    data: Subdistrict,
    status: SubdistrictStatus,
    error: SubdistrictError,
    mutate: getSubdistrict,
  } = useSubdistrict();

  
  const setProvinceFunc = (value: any) => {

    console.log(value);
    setDistrictList([]);
    setSubdistrictList([]);
    FormClaim.setFieldsValue({
      Province_Name: null,
      District:null,
      District_Name: null,
      Subdistrict:null
    });

    if(value != undefined || value != null){
      const Province = value.split("|");
      console.log(Province[0]);
      console.log(Province[1]);
      FormClaim.setFieldsValue({
        Province_Name: Province[1],
      });
      getDistrict(Province[0]);
    }
    
  };

  const setDistrictFunc = (value: any) => {

    console.log(value);
    setSubdistrictList([]);
    FormClaim.setFieldsValue({
      District_Name: null,
      Subdistrict:null
    });

    if(value != undefined || value != null){
      const District = value.split("|");
      console.log(District[0]);
      console.log(District[1]);
      FormClaim.setFieldsValue({
        District_Name: District[1],
      });
      getSubdistrict(District[0]);
    }
    
  };

  const setSubdistrictFunc = (value: any) => {

    console.log(value);
    FormClaim.setFieldsValue({
      Subdistrict_Name:null
    });

    if(value != undefined || value != null){
      const Subdistrict = value.split("|");
      console.log(Subdistrict[0]);
      console.log(Subdistrict[1]);
      FormClaim.setFieldsValue({
        Subdistrict_Name: Subdistrict[1],
        Postal_Code: Subdistrict[0]
      });
    }
    
  };



  useEffect(() => {
    FormClaim.setFieldsValue({
      Start_Date: moment(dateTime),
    });
    
  }, [dateTime]);


  useEffect(() => {
    if (DistrictStatus === "success") {
      
      setDistrictList(District?.data.data);
    } else if (DistrictStatus === "error") {
      message.error(DistrictError?.response?.data?.message || DistrictError.message);
    }
  }, [DistrictStatus]);

  useEffect(() => {
    if (SubdistrictStatus === "success") {
      setSubdistrictList(Subdistrict?.data.data);
    } else if (SubdistrictStatus === "error") {
      message.error(SubdistrictError?.response?.data?.message || SubdistrictError.message);
    }
  }, [SubdistrictStatus]);
  
  


  const handleOk = (value: any) => {
    //setLoading(true);

    console.log('save =',value);


    if (value?.Project_Index) {
      updateMutate(value);
    } else {
      createMutate(value);
    }
  };


  


  useEffect(() => {
    if (createStatus === "success") {
      message.success("Add Project Success");
      handleCloseModal();
      setLoading(false);
    } else if (createStatus === "error") {
      setLoading(false);
      message.error(
        createError?.response?.data?.message || createError.message
      );
    }
  }, [createStatus]);

  useEffect(() => {
    if (updateStatus === "success") {
      message.success("Update Project Success");
      handleCloseModal();
      setLoading(false);
    } else if (updateStatus === "error") {
      setLoading(false);
      message.error(
        updateError?.response?.data?.message || updateError.message
      );
    }
  }, [updateStatus]);

  const [value, setValue] = useState(1);

  const onChange = (e: RadioChangeEvent) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };




  return (
    <>
      <Modal
        visible={visible}
        title="แจ้งเคลมสินค้า"
        onOk={FormClaim.submit}
        onCancel={handleCloseModal}
        width={600}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={FormClaim.submit}
            icon={<SaveOutlined className="relative bottom-[0.2em]" />}
          >
            Submit
          </Button>,
          <Button
            key="back"
            type="ghost"
            danger
            onClick={handleCloseModal}
            icon={<CloseOutlined className="relative bottom-[0.2em]" />}
          >
            Cancel
          </Button>,
        ]}
      >
        <Form
          layout="vertical"
          form={FormClaim}
          name="FormClaim"
          onFinish={handleOk}
        >
          <Form.Item name="Claim_Index" label="Claim Index" hidden>
            <Input />
          </Form.Item>
          <Row>
            <Col span={24}>
              <Form.Item
                name="Name"
                label="ชื่อลูกค้า/Name"
                rules={[{ required: true, message: "Please enter Name" }]}
              >
                <Input placeholder="Please enter Name" disabled={parseInt(Claim?.event) !== 0 ? true : false}/>
              </Form.Item>
            </Col>
          </Row>
          
          <Row>
            <Col span={24}>
            <Form.Item
                name="Phone_Number"
                label="เบอร์โทรศัพท์/Phone Number"
                rules={[
                  { required: true, message: "Please enter Phone Number" },
                ]}
              >
                <Input placeholder="Please enter Phone Number" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                name="Product_Code"
                label="รหัสสินค้า/Product Code"
                rules={[{ required: true, message: "Please enter Product Code" }]}
              >
                <Input placeholder="Please enter Product Code"/>
              </Form.Item>
            </Col>
          </Row>
          
          <Row>
            <Col span={24}>
              <Form.Item
                name="Defective_Product_Qty"
                label="จำนวนที่เกิดปัญหา"
                rules={[
                  { required: true, message: "Please enter Defective Product Qty" },
                ]}
              >
                <InputNumber className="w-full"  />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
            
              <Form.Item
                name="Report_Work_Date"
                label="วันที่แจ้งงาน"
                rules={[
                  { required: true, message: "Please Select Date " },
                ]}
              >
                <DatePicker className="myDatePicker w-full"/>
              </Form.Item>
            </Col>
            
          </Row>
          <Row>
            <Col span={24}>
            
              <Form.Item
                name="Date_Arrive_Work_Site"
                label="วันที่ต้องการให้เข้าหน้างาน"
                rules={[
                  { required: true, message: "Please Select Date " },
                ]}
              >
                <DatePicker className="myDatePicker w-full"/>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                name="Claimant_Name"
                label="ชื่อผู้แจ้ง"
                rules={[
                  { required: true, message: "Please enter ชื่อผู้แจ้ง" },
                ]}
              >
                <Input placeholder="Please enter ชื่อผู้แจ้ง"/>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item
                name="Claimant_Agency"
                label="หน่วยงานผู้แจ้ง"
                rules={[
                  { required: true, message: "Please enter หน่วยงานผู้แจ้ง" },
                ]}
              >
                <Input placeholder="Please enter หน่วยงานผู้แจ้ง"/>
              </Form.Item>
            </Col>
          </Row>
          
        </Form>
      </Modal>

    </>
  );
};

export default FormClaim;
