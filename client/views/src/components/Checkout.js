import React, { useEffect } from 'react'
import Layout from './Layout'
import { connect } from 'react-redux';

function Checkout(props) {
    const {type} = props.match.params;
    console.log(props);
    useEffect(()=>{
        if(type == 'cart'){

        }
    },[]) 
    return (
        <Layout>

        </Layout>
    )
}
const mapStateToProps = state => ({cart:state.cart});

export default connect(mapStateToProps)(Checkout);