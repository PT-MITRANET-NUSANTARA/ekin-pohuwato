
import { LoadingOutlined } from '@ant-design/icons';

const LoaderPage = ({isLoading}) => {
    return (
        <div className="w-full h-full z-[9999] absolute rounded-2xl bg-black text-white opacity-75 flex items-center justify-center">
            <LoadingOutlined  size={100} />
        </div>
    );
};

export default LoaderPage;
