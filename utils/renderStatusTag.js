import { Tag } from "antd";

 const renderStatusTag = (status) => {
    switch (status) {
        case "approved":
            return <Tag color="blue" className="capitalize">{status}</Tag>;

        case "rejected":
            return <Tag color="red" className="capitalize w-fit">{status}</Tag>;

        case "submitted":
            return <Tag color="yellow" className="capitalize">{status}</Tag>;

        case "draft":
            return <Tag color="blue" className="capitalize">{status}</Tag>;

        default:
            return <Tag color="gray" className="capitalize">{status}</Tag>;
    }
};

export default renderStatusTag