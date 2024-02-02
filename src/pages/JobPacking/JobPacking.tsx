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
  PrinterOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import {
  useJobPacking,
  useDeleteJobPacking,
  useCreateJobPacking,
  useUpdateJobPacking,
  useJobPackingItem,
  useCreateQrCode,
  useClearQrCode,
} from "../../hooks/useJobPacking";
import { useJobNo } from "../../hooks/useJobNo";
import { useGrade } from "../../hooks/useGrade";
import { useUser } from "../../hooks/useUser";
import type { InputRef } from "antd";
import type { FormInstance } from "antd/lib/form";
import { useSelector } from "react-redux";
import { selectAuth } from "../../contexts/slices/authSlice";
import FormTag from "./TagQR";
import "./JobPacking.css";

const EditableContext = React.createContext<FormInstance<any> | null>(null);
interface Item {
  key: string;
  Grade_ID: Number;
  Grade_Name: string;
  Type: string;
  Lot_No: string;
  QTY: Number;
}
interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {}
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: React.Key;
  Grade_ID: Number;
  Grade_Name: string;
  Type: string;
  Lot_No: string;
  QTY: Number;
}

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const JobPacking: React.FC<any> = ({ MenuId, Menu_Index }) => {
  const { authResult } = useSelector(selectAuth);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibletag, setVisibleTag] = useState(false);
  const [displayPrint, setDisplayPrint] = useState(false);
  const [eventItem, setEventItem] = useState("Add");
  const [jobPackingTable, setJobPackingTable] = useState<any>([]);
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [formJobPacking] = Form.useForm();
  const { Option } = Select;

  const [hiddenCreateQR, setHiddenCreateQR] = useState(false);
  const [hiddenClearQR, setHiddenClearQR] = useState(true);
  const [disabled, setdisabled] = useState(false);

  const [jobdetail, setViewJob] = useState<any>({});
  const [JobNo, setJob] = useState(null);
  const [JobID, setJobID] = useState(null);

  const [statusCreate, setStatusCreate] = useState<any>(null);

  const [materialID, setMaterialID] = useState<any>(null);
  const [qtyGen, setQty] = useState<any>(0);
  const [LotNo, setLotNo] = useState<any>(null);
  const [dateTime, setDateTime] = useState(moment().format("YYYY-MM-DD"));
  const [receivedetail, setViewReceive] = useState<any>({});

  const { isLoading: isLoadingUser, data: users } = useUser();

  const {
    data: JobPackingItem,
    error: createErrorJobPackingItem,
    status: getStatusJobPackingItem,
    mutate: getJobPackingItem,
  } = useJobPackingItem();

  const {
    isLoading,
    isFetching,
    isError,
    data: JobPackingdata,
    status,
    error,
    refetch: mainrefetch,
  } = useJobPacking();

  const {
    error: createErrorJobPacking,
    status: createStatusJobPacking,
    mutate: createMutateJobPacking,
  } = useCreateJobPacking();

  const {
    error: updateErrorJobPacking,
    status: updateStatusJobPacking,
    mutate: updateMutateJobPacking,
  } = useUpdateJobPacking();

  const {
    error: createErrorQrCode,
    status: createStatusQrCode,
    data: QrItem,
    mutate: createMutateQrCode,
  } = useCreateQrCode();

  const {
    error: clearErrorQrCode,
    status: clearStatusQrCode,
    data: dataJobID,
    mutate: clearMutateQrCode,
  } = useClearQrCode();

  const {
    data: DocNo,
    status: RCNoStatus,
    error: RCNoError,
    mutate: getJobNo,
  } = useJobNo();

  const {
    data: GradeItem,
  } = useGrade();

  const {
    error: deleteError,
    status: deleteStatus,
    mutate: deleteMutate,
  } = useDeleteJobPacking();

  const handleShowModelTag = () => {
    setVisibleTag(true);
  };

  const handleCloseModelTag = () => {
    setVisibleTag(false);
    mainrefetch();
  };

  const menu = (record: any) => (
    <Menu
      onClick={(e) => {
        handleMenu(e, record);
      }}
    >
      <Menu.Item key="1" icon={<EditOutlined />}>
        Detail
      </Menu.Item>
      <Menu.Item key="2" icon={<PrinterOutlined />}>
        Print
      </Menu.Item>
      <Menu.Item key="3" danger icon={<DeleteOutlined />}>
        Delete
      </Menu.Item>
    </Menu>
  );
  const handleMenu = (e: any, record: any) => {
    switch (e.key) {
      case "1":
        setViewJob({ ...record, event: e.key });
        getJobPackingItem(record.Job_ID);
        showModal("Detail");
        break;
      case "2":
        setViewReceive({ ...record, event: e.key });
        handleShowModelTag();
        if (record.Job_Status == 9) {
          setDisplayPrint(false);
        } else {
          setDisplayPrint(true);
        }
        break;
      case "3":
        if (record.status > 2) {
          Modal.error({
            title: "Message",
            content: `Can't delete Job No : ${record.Job_No}`,
          });
        } else {
          Modal.confirm({
            title: "Delete Confirm",
            content: <>{`Do you want delete Job No : ${record.Job_No} ?`}</>,
            onOk: () => {
              deleteMutate(record.Job_No);
            },
          });
        }

        break;
    }
  };

  useEffect(() => {
    if (getStatusJobPackingItem === "success") {
      setDataSource(JobPackingItem?.data.data || []);

    } else if (getStatusJobPackingItem === "error") {
      message.error(
        createErrorJobPackingItem?.response?.data?.message ||
          createErrorJobPackingItem.message
      );
    }
  }, [getStatusJobPackingItem]);

  const handleCancel = () => {
    setVisible(false);
    formJobPacking.resetFields();
    setDataSource([]);
    setViewJob({});
    setStatusCreate(null);
    setCount(0);
    mainrefetch();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 0) {
      const JobPackingDataSearch = JobPackingdata?.data.data.filter(
        (value: any) => {
          return Object.keys(value).some((key: any) =>
            String(value[key])
              .toLowerCase()
              .includes(e.target.value.toLowerCase())
          );
        }
      );
      setJobPackingTable(JobPackingDataSearch);
    } else {
      setJobPackingTable(JobPackingdata?.data.data || []);
    }
  };

  useEffect(() => {
    setJobPackingTable(JobPackingdata?.data.data || []);
  }, [isFetching]);

  useEffect(() => {
    formJobPacking.resetFields();

    formJobPacking.setFieldsValue({
      Job_Index: jobdetail?.Job_ID || null,
      Job_No: jobdetail?.Job_No || null,
      Job_Date: moment(jobdetail?.Job_Datetime),
      Job_Remark: jobdetail?.Remark || null,
      Job_Section: jobdetail?.Section || authResult?.data?.Group_Name,
      Request_By: jobdetail?.Request_By || authResult?.data?.FirstName,
      Receiver: jobdetail?.Receive_By || null,
      Grade_ID: jobdetail?.ITEM_ID || null,
      Grade_Name: jobdetail?.ITEM_CODE || null,
      Qty: jobdetail?.Qty || null,
      Lot_No: jobdetail?.Lot_No || null,
    });
    setJob(jobdetail?.Job_No);
    setMaterialID(jobdetail?.ITEM_ID);
    setQty(jobdetail?.Qty);
    setLotNo(jobdetail?.Lot_No);

    if (jobdetail?.Job_Status == 9) {
      setHiddenCreateQR(true);
      setHiddenClearQR(true);
    } else {
    }
  }, [jobdetail]);

  const [count, setCount] = useState(1);

  const setMaterialFunc = (value: any) => {
    setMaterialID(value);
    formJobPacking.setFieldsValue({
      Grade_ID: value,
    });
  };

  const setQtyFunc = (event: any) => {
    setQty(event);
  };

  const setLotNoFunc = (event: any) => {
    setLotNo(event.target.value);
  };

  const setDateFunc = (event: any) => {
    const newDate = moment(event).format("YYYY-MM-DD");
    setDateTime(newDate);
  };

  const onCreateQrCode = (record: any) => {
    if (dateTime != null && dateTime != "Invalid date") {
      if (materialID != null) {
        if (qtyGen > 0) {
          createMutateQrCode({
            data1: JobNo,
            data2: dateTime,
            data3: materialID,
            data4: qtyGen,
            data5: LotNo,
            data6: JobID,
          });
        }
      }
    }
  };

  const onClearQrCode = (record: any) => {
    if (JobNo != null && JobNo != "") {
      clearMutateQrCode({ data1: JobNo });
    }
  };

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex: string;
  })[] = [
    {
      title: "QR No",
      dataIndex: "QR_NO",
      width: "20%",
      // editable: true,
    },
    {
      title: "Material",
      dataIndex: "ITEM_DESCRIPTION",
      width: "30%",
      // editable: true,
    },
    {
      title: "Type",
      dataIndex: "Type",
      width: "20%",
      // editable: true,
    },
    {
      title: "Lot No",
      dataIndex: "Lot_No",
      align: "center",
      width: "20%",
      editable: true,
    },
    {
      title: "QTY",
      dataIndex: "QTY",
      align: "center",
      // editable: true,
    },
  ];

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const showModal = (value: any) => {
    setVisible(true);
    setEventItem(value);

    if (value == "Add") {
      //ถ้าคลิกปุ่ม Add Gen เลขใบรับใหม่
      getJobNo(1);
      setStatusCreate("New");
      setHiddenCreateQR(false);
      setHiddenClearQR(true);
      setdisabled(false);

      formJobPacking.resetFields();
      formJobPacking.setFieldsValue({
        Job_No: DocNo?.data.data[0].JobNo,
        Job_Date: moment(),
        Request_By: authResult?.data?.FirstName,
        Job_Section: authResult?.data?.Group_Name,
      });
    } else {
      setHiddenCreateQR(true);
      setHiddenClearQR(false);
      setdisabled(true);
    }
  };

  const handleOk = (value: any) => {
    const newData = [...dataSource];
    if (newData.length > 0) {
      if (value?.Job_Index) {
        updateMutateJobPacking({ data: value, data2: newData });
      } else {
        //createMutateJobPacking({ data: value, data2: newData });
      }
    } else {
      Modal.error({
        title: "Insert message",
        content: `สร้าง qr code ก่อน`,
      });
    }
  };

  useEffect(() => {
    if (createStatusJobPacking === "success") {
      message.success("Add Job Success");
      handleCancel();
      setLoading(false);
    } else if (createStatusJobPacking === "error") {
      message.error(
        createErrorJobPacking?.response?.data?.message ||
          createErrorJobPacking.message
      );
      setLoading(false);
    }
  }, [createStatusJobPacking]);

  useEffect(() => {
    if (createStatusQrCode === "success") {
      message.success("Create QR Code Success");

      setDataSource(QrItem?.data.data || []);
      setHiddenCreateQR(true);
      setHiddenClearQR(false);
      formJobPacking.setFieldsValue({
        Job_Index: QrItem?.data.data[0].Job_ID,
        Job_No: QrItem?.data.data[0].Job_No,
      });

      setdisabled(true);
    } else if (createStatusQrCode === "error") {
      message.error(
        createErrorQrCode?.response?.data?.message || createErrorQrCode.message
      );
      setLoading(false);
    }
  }, [createStatusQrCode]);

  useEffect(() => {
    if (clearStatusQrCode === "success") {
      message.success("Clear QR Code Success");
      setDataSource([]);
      setHiddenCreateQR(false);
      setHiddenClearQR(true);
      setdisabled(false);
      setJobID(dataJobID?.data.data[0].Job_ID);
    } else if (clearStatusQrCode === "error") {
      message.error(
        createErrorQrCode?.response?.data?.message || createErrorQrCode.message
      );
      setLoading(false);
    }
  }, [clearStatusQrCode]);

  useEffect(() => {
    if (updateStatusJobPacking === "success") {
      message.success("Update JobPacking Success");
      handleCancel();
      setLoading(false);
    } else if (updateStatusJobPacking === "error") {
      message.error(
        updateErrorJobPacking?.response?.data?.message ||
          updateErrorJobPacking.message
      );
      setLoading(false);
    }
  }, [updateStatusJobPacking]);

  useEffect(() => {
    if (deleteStatus === "success") {
      message.success("Delete Job Part Success");
      // handleCancel();
    } else if (deleteStatus === "error") {
      message.error(
        deleteError?.response?.data?.message || deleteError.message
      );
    }
  }, [deleteStatus]);

  useEffect(() => {
    if (RCNoStatus === "success") {
      setJob(DocNo?.data.data[0].JobNo);
    } else if (RCNoStatus === "error") {
      message.error(RCNoError?.response?.data?.message || RCNoError.message);
    }
  }, [RCNoStatus]);

  useEffect(() => {
    formJobPacking.setFieldsValue({
      Job_No: JobNo || null,
    });
  }, [JobNo]);


  const columns_main = [
    {
      title: "",
      key: "Action",
      className: "w-10",
      render: (text: any, record: any, index: any) => {
        return (
          <Dropdown trigger={["click"]} overlay={menu(record)}>
            <Button>
              Action <DownOutlined />
            </Button>
          </Dropdown>
        );
      },
    },
    {
      title: "Job No",
      dataIndex: "Job_No",
      key: "Job_No",
      align: "center",
      sorter: (a: any, b: any) => a.Job_No.localeCompare(b.Job_No),
    },

    {
      title: "Date",
      dataIndex: "Date1",
      key: "Date1",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.Date1.localeCompare(b.Date1),
    },
    {
      title: "Material Code",
      dataIndex: "ITEM_CODE",
      key: "ITEM_CODE",
      align: "center",
      sorter: (a: any, b: any) => a.ITEM_CODE.localeCompare(b.ITEM_CODE),
    },
    {
      title: "Remark",
      dataIndex: "Remark",
      key: "Remark",
      align: "center",
      responsive: ["lg"],
    },
    {
      title: "Receiver",
      dataIndex: "Receive_By",
      key: "Receive_By",
      align: "center",
      responsive: ["lg"],
    },

    {
      title: "Status",
      dataIndex: "Status_desc",
      key: "Status_desc",
      align: "center",
      sorter: (a: any, b: any) => a.Status_desc.localeCompare(b.Status_desc),
      render: (text: any, record: any, index: any, color: any) => {
        if (text == "Create Qr Code") {
          color = "warning";
        } else if (text == "Complete") {
          color = "success";
        } else {
          color = "error";
        }
        return (
          <Tag color={color} style={{ width: 100 }}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Create By",
      dataIndex: "Create_By",
      key: "Create_By",
      align: "center",
      responsive: ["lg"],
      sorter: (a: any, b: any) => a.Create_By.localeCompare(b.Create_By),
    },
  ];

  return (
    <>
      <Space className="w-[100%]" direction="vertical">
        <Row>
          <Col flex={1}>
            <Button
              type="primary"
              className="btn-success"
              icon={<PlusOutlined className="relative bottom-[0.2em]" />}
              onClick={() => showModal("Add")}
            >
              Add
            </Button>
          </Col>
          <Col className="flex justify-end items-center" flex={1}>
            <Input
              style={{ width: 300 }}
              prefix={<SearchOutlined />}
              placeholder="Search"
              onChange={(e) => handleSearch(e)}
            />
          </Col>
        </Row>
        <Table
          rowKey={(record: any) => record.User_Index}
          rowClassName={(record, index) =>
            index % 2 === 0 ? "table-row-light" : "table-row-dark"
          }
          bordered
          size="small"
          // loading={isLoading}
          columns={columns_main as any}
          dataSource={jobPackingTable}
          pagination={{ pageSize: 50 }}
        />
      </Space>

      <Modal
        visible={visible}
        title="Job Packing"
        style={{ top: 20 }}
        onOk={formJobPacking.submit}
        onCancel={handleCancel}
        width={800}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={formJobPacking.submit}
            icon={<SaveOutlined className="relative bottom-[0.2em]" />}
          >
            Submit
          </Button>,
          <Button
            key="back"
            type="ghost"
            danger
            onClick={handleCancel}
            icon={<CloseOutlined className="relative bottom-[0.2em]" />}
          >
            Cancel
          </Button>,
        ]}
      >
        <Form
          layout="vertical"
          form={formJobPacking}
          name="formJobPacking"
          onFinish={handleOk}
        >
          <Space direction="vertical" size="middle" style={{ display: "flex" }}>
            <Card>
              <Form.Item name="Job_Index" label="Job_Index" hidden>
                <Input />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="Job_No" label="Job No :">
                    <Input style={{ background: "#f5f5f5" }} readOnly />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="Job_Date"
                    label="Date :"
                    rules={[
                      {
                        required: true,
                        message: "Please choose Date",
                      },
                    ]}
                  >
                    <DatePicker
                      className="myDatePicker"
                      style={{ width: 340 }}
                      onChange={setDateFunc}
                      disabled={disabled}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: -17 }}>
                <Col span={12}>
                  <Form.Item name="Job_Section" label="Section">
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="Request_By" label="ผู้จ่าย :">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: -17 }}>
                <Col span={12}>
                  <Form.Item name="Job_Remark" label="Remark">
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="Receiver" label="ผู้รับ :">
                    <Select
                      placeholder="Please Receiver"
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option!.children as unknown as string)
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {users?.data.data.map((value: any) => {
                        return (
                          <Option key={value.UserName} value={value.UserName}>
                            {value.UserName}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Card style={{ background: "#93c5fd" }}>
                <Row gutter={16} style={{ marginTop: -17 }}>
                  <Col span={12}>
                    <Form.Item name="Grade_ID" label="Grade_ID" hidden>
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="Grade_Name"
                      label="Material"
                      rules={[
                        {
                          required: true,
                          message: "Please choose Material",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Please choose Material"
                        onChange={(e) => setMaterialFunc(e)}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          (option!.children as unknown as string)
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        disabled={disabled}
                      >
                        {GradeItem?.data?.data?.map((value: any) => {
                          return (
                            <Option key={value.ITEM_CODE} value={value.ITEM_ID}>
                              {value.ITEM_CODE}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="Qty" label="Qty :">
                      <InputNumber
                        onChange={setQtyFunc}
                        style={{ width: "100%" }}
                        step="1"
                        min={1}
                        max={100000}
                        disabled={disabled}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="Lot_No" label="Lot No :">
                      <Input onChange={setLotNoFunc} disabled={disabled} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row
                  gutter={16}
                  style={{
                    marginTop: -17,
                    marginBottom: -15,
                    textAlign: "center",
                  }}
                >
                  <Col span={24}>
                    <div hidden={hiddenCreateQR}>
                      <Button
                        onClick={onCreateQrCode}
                        type="primary"
                        className="btn-success"
                        style={{
                          marginBottom: 16,
                        }}
                        icon={
                          <PlusOutlined className="relative bottom-[0.2em]" />
                        }
                      >
                        Create
                      </Button>
                    </div>
                    <div hidden={hiddenClearQR}>
                      <Button
                        onClick={onClearQrCode}
                        type="primary"
                        className="btn-warning"
                        style={{
                          marginBottom: 16,
                        }}
                        icon={
                          <ClearOutlined className="relative bottom-[0.2em]" />
                        }
                      >
                        Clear
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Card>

            <Card>
              <div>
                <Table
                  rowClassName={(record, index) =>
                    index % 2 === 0 ? "table-row-light" : "table-row-dark"
                  }
                  components={components}
                  bordered
                  dataSource={dataSource}
                  columns={columns as ColumnTypes}
                  pagination={{ pageSize: 10 }}
                />
              </div>
            </Card>
          </Space>
        </Form>
      </Modal>
      {
        <FormTag
          visible={visibletag}
          handleCloseModelTag={handleCloseModelTag}
          tag={receivedetail}
          displayPrint={displayPrint}
        />
      }
    </>
  );
};

export default JobPacking;
