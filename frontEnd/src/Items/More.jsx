import React from 'react'
import { useLocation } from 'react-router-dom';
import { BaseUrl } from '../BaseUrl';

const More = () => {
    window.scrollTo(0,0);

    const location = useLocation();
    const { itemData } = location.state || {};
    console.log(itemData);

    return (
        <>
            <div className='itemData'>
                <img src={`${BaseUrl}/${itemData.picture}`} alt='img' />
            </div>
            <div className='itemDetails'>
                <h2>Details:</h2>
                <table>
                    <tr>
                        <td>ID</td>
                        <td>{itemData.number}</td>
                    </tr>
                    <tr>
                        <td>Name</td>
                        <td>{itemData.name}</td>
                    </tr>
                    <tr>
                        <td>Category</td>
                        <td>{itemData.category_ID.name}</td>
                    </tr>
                    <tr>
                        <td>Company</td>
                        <td>{itemData.company_ID.name}</td>
                    </tr>
                    <tr>
                        <td>Status</td>
                        <td>{itemData.status_ID.name}</td>
                    </tr>
                    <tr>
                        <td>Location</td>
                        <td>{itemData.location_ID.name}</td>
                    </tr>
                    <tr>
                        <td>Purchase Date</td>
                        <td>{itemData.purchase_date}</td>
                    </tr>
                    <tr>
                        <td>Control Under</td>
                        <td>{itemData.users_ID.name}</td>
                    </tr>

                </table>
                {(itemData.spex_ID !== null) ?
                    <>
                        <h2>Specifications:</h2>
                        <table>
                            <tr>
                                <td>Operating System</td>
                                {itemData.spex_ID.OS_ID ?
                                    <td>{itemData.spex_ID.OS_ID.name}</td> :
                                    <td>null</td>
                                }
                            </tr>
                            <tr>
                                <td>Softwares</td>
                                <td>
                                    <table>
                                        {itemData.spex_ID.softwares_ID && itemData.spex_ID.softwares_ID.length > 0 ? itemData.spex_ID.softwares_ID.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.name}</td>
                                                <td>{item.version}</td>
                                            </tr>
                                        )) : <tr>
                                            <td>null</td>
                                        </tr>
                                        }
                                    </table>

                                </td>
                            </tr>
                            <tr>
                                <td>Rom</td>
                                <td>
                                    <table>
                                        {itemData.spex_ID.rom_ID && itemData.spex_ID.rom_ID.length > 0 ?
                                            itemData.spex_ID.rom_ID.map((romItem, index) => (
                                                <tr key={index}>
                                                    <td>{romItem.size}</td>
                                                    {romItem.romType_ID && romItem.romType_ID.name ?
                                                        <td>{romItem.romType_ID.name}</td>
                                                        : <td>null</td>
                                                    }
                                                </tr>
                                            )) :
                                            <tr>
                                                <td>null</td>
                                            </tr>
                                        }
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td>Ram</td>
                                <td>
                                    <table>
                                        {itemData.spex_ID.ram_ID && itemData.spex_ID.ram_ID.length > 0 ?
                                            itemData.spex_ID.ram_ID.map((ramItem, index) => (
                                                <tr key={index}>
                                                    <td>{ramItem.size}</td>
                                                    {ramItem.ramType_ID && ramItem.ramType_ID.name ?
                                                        <td>{ramItem.ramType_ID.name}</td>
                                                        : <td>null</td>
                                                    }
                                                </tr>
                                            )) :
                                            <tr>
                                                <td>null</td>
                                            </tr>
                                        }
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td>Graphic Card</td>
                                <td>
                                    <table>
                                        {itemData.spex_ID.graphicCard_ID ? 
                                            <tr >
                                                <td>{itemData.spex_ID.graphicCard_ID.size}</td>
                                                <td>{itemData.spex_ID.graphicCard_ID.GCType_ID.name}</td>
                                            </tr>
                                         : <tr>
                                            <td>null</td>
                                        </tr>
                                        }
                                    </table>

                                </td>
                            </tr>
                            <tr>
                                <td>Generation</td>
                                {itemData.spex_ID.generation_ID ?
                                    <td>{itemData.spex_ID.generation_ID.name}</td>
                                    :
                                    <td>null</td>
                                }
                            </tr>
                            <tr>
                                <td>Cable Type</td>
                                {itemData.spex_ID.cableType_ID ?
                                    
                                        <td>{itemData.spex_ID.cableType_ID.name}</td>
                                    :
                                    <td>null</td>
                                }
                            </tr>
                            <tr>
                                <td>LCD Size </td>
                                {itemData.spex_ID.lcd_size ?
                                    <td>{itemData.spex_ID.lcd_size}</td> :
                                    <td>null</td>
                                }
                            </tr>
                            <tr>
                                <td>Furniture Desc</td>
                                {itemData.spex_ID.furniture_Desc ?
                                    <td>{itemData.spex_ID.furniture_Desc}</td> :
                                    <td>null</td>
                                }
                            </tr>

                        </table></> : ''
                }

            </div>
        </>


    )
}

export default More