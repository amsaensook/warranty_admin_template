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
  Card, 
  Typography,
  Image
} from "antd";
import {
  PrinterOutlined
} from "@ant-design/icons";
import moment from "moment";
import { 
  SaveOutlined, 
  CloseOutlined 
} from "@ant-design/icons";
import { 
  useDeleteCustomer, 
  useCreateCustomer, 
  useUpdateCustomer 
} from "../../hooks/useCustomer";
import { useProductType } from "../../hooks/useProductType";
import { useProvince } from "../../hooks/useProvince";
import { useDistrict } from "../../hooks/useDistrict";
import { useSubdistrict } from "../../hooks/useSubdistrict";
import avatar from "../../assets/avatar-icon.png";


const FormCustomer: React.FC<any> = ({ visible, handleCloseModal, customer }) => {

  const [loading, setLoading] = useState(false);
  const [hiddenPrint, setHiddenPrint] = useState(false);
  const [dataSourcePrint, setDataSourcePrint] = useState<any>([]);
  const [districtList, setDistrictList] = useState<any>([]);
  const [subdistrictList, setSubdistrictList] = useState<any>([]);

  const [formCustomer] = Form.useForm();
  const [formPrint] = Form.useForm();
  const { Option } = Select;
  
  const cardStyle: React.CSSProperties = {
    width: 250,
  };
  
  const imgStyle: React.CSSProperties = {
    display: 'block',
    width: 273,
  };
  const {
    error: createError,
    status: createStatus,
    mutate: createMutate,
  } = useCreateCustomer();

  const {
    error: updateError,
    status: updateStatus,
    mutate: updateMutate,
  } = useUpdateCustomer();

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
    formCustomer.setFieldsValue({
      Province_Name: null,
      District:null,
      District_Name: null,
      Subdistrict:null
    });

    if(value != undefined || value != null){
      const Province = value.split("|");
      console.log(Province[0]);
      console.log(Province[1]);
      formCustomer.setFieldsValue({
        Province_Name: Province[1],
      });
      getDistrict(Province[0]);
    }
    
  };

  const setDistrictFunc = (value: any) => {

    console.log(value);
    setSubdistrictList([]);
    formCustomer.setFieldsValue({
      District_Name: null,
      Subdistrict:null
    });

    if(value != undefined || value != null){
      const District = value.split("|");
      console.log(District[0]);
      console.log(District[1]);
      formCustomer.setFieldsValue({
        District_Name: District[1],
      });
      getSubdistrict(District[0]);
    }
    
  };

  const setSubdistrictFunc = (value: any) => {

    console.log(value);
    formCustomer.setFieldsValue({
      Subdistrict_Name:null
    });

    if(value != undefined || value != null){
      const Subdistrict = value.split("|");
      console.log(Subdistrict[0]);
      console.log(Subdistrict[1]);
      formCustomer.setFieldsValue({
        Subdistrict_Name: Subdistrict[1],
        Postal_Code: Subdistrict[0]
      });
    }
    
  };


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

    if (value?.Customer_Index) {
      updateMutate(value);
    } else {
      createMutate(value);
    }
  };


  


  useEffect(() => {
    if (createStatus === "success") {
      message.success("Add Customer Success");
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
      message.success("Update Customer Success");
      handleCloseModal();
      setLoading(false);
    } else if (updateStatus === "error") {
      setLoading(false);
      message.error(
        updateError?.response?.data?.message || updateError.message
      );
    }
  }, [updateStatus]);




  return (
    <>
      <Modal
        visible={visible}
        title="เพิ่มข้อมูลลูกค้า"
        onOk={formCustomer.submit}
        onCancel={handleCloseModal}
        width={1000}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={formCustomer.submit}
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
          form={formCustomer}
          name="formCustomer"
          onFinish={handleOk}
        >
          <Form.Item name="Customer_Index" label="Customer Index" hidden>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
            <Card>
              <Image src={avatar} preview={false} style={{ width: 500 }} />
            </Card>
            </Col>
            <Col span={16}>

              <Row gutter={24}>
                <Col span={12}>
                <Form.Item
                    name="ID_Card_Number"
                    label="เลขบัตรประชาชน/ID card number"
                    rules={[{ required: true, message: "Please enter ID card number" }]}
                  >
                    <Input placeholder="Please enter ID card number" disabled={parseInt(customer?.event) !== 0 ? true : false}/>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                      name="prefix"
                      label="คำนำหน้าชื่อ/Prefix"
                      rules={[
                        {
                          required: true,
                          message: "เลือกคำนำหน้า",
                        },
                      ]}
                    >
                      <Radio.Group>
                      <Radio value={'นาย'}>นาย</Radio>
                      <Radio value={'นาง'}>นาง</Radio>
                      <Radio value={'นางสาว'}>นางสาว</Radio>
                    </Radio.Group>
                    </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="Name_Customer"
                    label="ชื่อ/Name"
                    rules={[
                      { required: true, message: "Please enter Name" },
                    ]}
                  >
                    <Input placeholder="Please enter Name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="Surname_Customer"
                    label="นามสกุล/Surname"
                    rules={[
                      { required: true, message: "Please enter Surname" },
                    ]}
                  >
                    <Input placeholder="Please enter Surname" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="Phone_Number"
                    label="เบอร์โทรศัพท์มือถิอ/Phone Number"
                    rules={[
                      { required: true, message: "Please enter Phone Number" },
                    ]}
                  >
                    <Input placeholder="Please enter Phone Number" />
                  </Form.Item>
                </Col>
              </Row>

            </Col>

          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="Address"
                label="บ้านเลขที่/Address"
                rules={[{ required: true, message: "Please enter Address" }]}
              >
                <Input placeholder="Please enter Address" />
              </Form.Item>
            </Col>

            <Col span={12}>
                <Form.Item name="Province_Name" label="Province_Name" hidden>
                  <Input />
                </Form.Item>
              <Form.Item
                name="Province"
                label="จังหวัด/Province"
                rules={[{ required: true, message: "Please choose Province" }]}
              >
                <Select
                  placeholder="Please choose Province"
                  onChange={(e) => setProvinceFunc(e)}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option!.children as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  
                >
                  {Province?.data?.data?.map((value: any) => {
                    return (
                      <Option
                        key={value.id}
                        value={value.id + "|" + value.name_th }
                      >
                        {value.name_th}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
            <Form.Item name="District_Name" label="District_Name" hidden>
              <Input />
            </Form.Item>
            <Form.Item
                name="District"
                label="อำเภอ/เขต/District"
                rules={[{ required: true, message: "Please choose District" }]}
              >
                <Select
                  placeholder="Please choose District"
                  onChange={(e) => setDistrictFunc(e)}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option!.children as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  
                >
                  {districtList?.map((value: any) => {
                    return (
                      <Option
                        key={value.id}
                        value={value.id + "|" + value.name_th }
                      >
                        {value.name_th}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
            <Form.Item name="Subdistrict_Name" label="Subdistrict_Name" hidden>
              <Input />
            </Form.Item>
            <Form.Item
                name="Subdistrict"
                label="ตำบล/แขวง/Subdistrict"
                rules={[{ required: true, message: "Please choose Subdistrict" }]}
              >
                <Select
                  placeholder="Please choose Subdistrict"
                  onChange={(e) => setSubdistrictFunc(e)}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option!.children as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  
                >
                  {subdistrictList?.map((value: any) => {
                    return (
                      <Option
                        key={value.id}
                        value={value.zip_code + "|" + value.name_th }
                      >
                        {value.name_th}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="Postal_Code"
                label="รหัสไปรษณีย์/Postal Code"
                rules={[
                  { required: true, message: "Please enter Postal Code" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="Link_Google_Map"
                label="Link Google Map"
              >
                <Input placeholder="Please enter Link" />
              </Form.Item>
            </Col>
          </Row>
          
        </Form>
      </Modal>

    </>
  );
};

export default FormCustomer;
