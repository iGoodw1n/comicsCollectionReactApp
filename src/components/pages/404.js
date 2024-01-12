import { Helmet, HelmetProvider } from "react-helmet-async";
import ErrorMessage from "../errorMessage/ErrorMessage"
import { Link } from "react-router-dom"

const Page404 = () => {
    return (
        <div>
            <HelmetProvider>
                <Helmet>
                    <meta
                        name="description"
                        content="This page is not found"
                    />
                    <title>This page is not found</title>
                </Helmet>
            </HelmetProvider>
            <ErrorMessage />
            <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '24px' }}>Page doesn't exist</p>
            <Link
                style={{ display: 'block', textAlign: 'center', fontWeight: 'bold', fontSize: '24px', marginTop: '30px' }}
                to="/">
                Back to main page
            </Link>
        </div>
    )
}

export default Page404;