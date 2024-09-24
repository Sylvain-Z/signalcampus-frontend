import Header from './Header'
import Footer from './Footer'

function HOC({ child, auth  }) {

    const Child = child

    return (
        <div>

            <Header />
            <main>
                <Child />
            </main>
            <Footer />


        </div>
    );
}

export default HOC;