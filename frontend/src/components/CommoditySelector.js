import React from 'react';

const CommoditySelector = ({ selected, setSelected }) => {
    const allCommodities = ['XAU', 'WTIOIL-FUT', 'XAG', 'BRENTOIL-FUT', 'NG-FUT'];

    const toggleCommodity = (symbol) => {
        if (selected.includes(symbol)) {
            setSelected(selected.filter(s => s !== symbol));
        } else {
            setSelected([...selected, symbol]);
        }
    };

    return (
        <div>
            <h3>Select Commodities</h3>
            {allCommodities.map(symbol => (
                <label key={symbol} style={{marginRight:'10px'}}>
                    <input 
                        type="checkbox" 
                        checked={selected.includes(symbol)} 
                        onChange={() => toggleCommodity(symbol)}
                    />
                    {symbol}
                </label>
            ))}
        </div>
    );
}

export default CommoditySelector;
