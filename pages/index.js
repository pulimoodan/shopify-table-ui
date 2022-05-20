import React, { useState, useCallback, useEffect } from 'react';
import '@shopify/polaris/build/esm/styles.css';
import enTranslations from '@shopify/polaris/locales/en.json';
import {AppProvider, Page, Card, Thumbnail, Layout, IndexTable, Filters, ChoiceList, TextStyle, Button, Modal, TextContainer, Heading} from '@shopify/polaris';

export default function ProductsList ({ products })
{
    // variables
    const [rows, setRows] = useState([]);
    const [category, setCategory] = useState(null);
    const [queryValue, setQueryValue] = useState(null);
    const [modalActive, setModalActive] = useState(false);
    const [activeProduct, setActiveProduct] = useState({});

    // handle product view modal
    const handleModalChange = useCallback(() => setModalActive(!modalActive), [modalActive]);
    
    // resource name for index table
    const resourceName = {
        singular: 'product',
        plural: 'products',
    };

    useEffect(() => {  

        // 1st step : categrorizing acoording to filter
        var categorizedProducts = [];
        products.map((product) => {
            if (!isEmpty(category))
            {
                if (category.includes(product.category))
                {
                    categorizedProducts.push(product);
                }
            }
            else
            {
                categorizedProducts.push(product);
            }
        });

        // 2nd step : filter categorized products according to query value
        var newRows = [];
        categorizedProducts.map((product, index) => {
            if (!isEmpty(queryValue))
            {
                if (product.title.toLowerCase().includes(queryValue.toLowerCase()))
                {
                    newRows.push(
                        <IndexTable.Row
                            id={product.id}
                            key={product.id}
                            position={index}
                        >
                            <IndexTable.Cell>
                                <TextStyle variation="strong">{product.id}</TextStyle>
                            </IndexTable.Cell>
                            <IndexTable.Cell>
                                <Thumbnail
                                    source={product.image}
                                    alt={truncate(product.title)}
                                    size="small"
                                />    
                            </IndexTable.Cell>
                            <IndexTable.Cell>{truncate(product.title, 20)}</IndexTable.Cell>
                            <IndexTable.Cell>{product.category}</IndexTable.Cell>
                            <IndexTable.Cell>{product.price}</IndexTable.Cell>
                            <IndexTable.Cell>{product.rating.rate}</IndexTable.Cell>
                            <IndexTable.Cell>{truncate(product.description, 20)}</IndexTable.Cell>
                            <IndexTable.Cell>
                                <Button size='slim' onClick={()=>handleProduct(product)}>Details</Button>    
                            </IndexTable.Cell>
                        </IndexTable.Row>
                    );
                }
            }
            else
            {
                newRows.push(
                    <IndexTable.Row
                        id={product.id}
                        key={product.id}
                        position={index}
                    >
                        <IndexTable.Cell>
                            <TextStyle variation="strong">{product.id}</TextStyle>
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                            <Thumbnail
                                source={product.image}
                                alt={truncate(product.title)}
                                size="small"
                            />    
                        </IndexTable.Cell>
                        <IndexTable.Cell>{truncate(product.title, 20)}</IndexTable.Cell>
                        <IndexTable.Cell>{product.category}</IndexTable.Cell>
                        <IndexTable.Cell>{product.price}</IndexTable.Cell>
                        <IndexTable.Cell>{product.rating.rate}</IndexTable.Cell>
                        <IndexTable.Cell>{truncate(product.description, 20)}</IndexTable.Cell>
                        <IndexTable.Cell>
                            <Button size='slim' onClick={()=>handleProduct(product)}>Details</Button>    
                        </IndexTable.Cell>
                    </IndexTable.Row>
                );
            }
        });
        setRows(newRows);
    }, [category, queryValue]);

    // handling single product view
    const handleProduct = (product) =>
    {
        setActiveProduct(product);
        handleModalChange();
    }

    // handle filters 
    const handleCategoryChange = useCallback(
        (value) => setCategory(value),
        [],
    );
    const handleFiltersQueryChange = useCallback(
        (value) => setQueryValue(value),
        [],
    );
    
    // handle filters removal
    const handleCategoryRemove = useCallback(() => setCategory(null), []);
    const handleQueryValueRemove = useCallback(() => setQueryValue(null), []);
    const handleFiltersClearAll = useCallback(() => {
        handleCategoryRemove();
        handleQueryValueRemove();
    }, [
        handleCategoryRemove,
        handleQueryValueRemove,
    ]);

    // filters list
    const filters = [
        {
        key: 'category',
        label: 'Category',
        filter: (
            <ChoiceList
            title="Category"
            titleHidden
            choices={[
                {label: 'Men\'s clothing', value: 'men\'s clothing'},
                {label: 'Women\'s clothing', value: 'women\'s clothing'},
                {label: 'Electronics', value: 'electronics'},
                {label: 'Jewelery', value: 'jewelery'},
            ]}
            selected={category || []}
            onChange={handleCategoryChange}
            allowMultiple
            />
        ),
        shortcut: true,
        },
    ];

    // applide filters
    const appliedFilters = [];
    if (!isEmpty(category)) {
        const key = 'category';
        appliedFilters.push({
            key,
            label: disambiguateLabel(key, category),
            onRemove: handleCategoryRemove,
        });
    }

    // jsx
    return (
        <AppProvider i18n={enTranslations}>
            <Page singleColumn title="Products">
                <Layout>
                    <Layout.Section>
                    <Card>
                        {/* filters */}
                        <Card.Section>
                            <Filters
                                queryValue={queryValue}
                                filters={filters}
                                appliedFilters={appliedFilters}
                                onQueryChange={handleFiltersQueryChange}
                                onQueryClear={handleQueryValueRemove}
                                onClearAll={handleFiltersClearAll}
                            />
                        </Card.Section>

                        {/* table */}
                        <IndexTable
                            resourceName={resourceName}
                            itemCount={rows.length}
                            selectable={false}
                            headings={[
                                {title: "Id"},
                                {title: "Image"},
                                {title: "Product"},
                                {title: "Category"},
                                {title: "Price"},
                                {title: "Rating"},
                                {title: "Description"},
                            ]}
                        >
                            {rows}
                        </IndexTable>

                    </Card>
                    </Layout.Section>
                </Layout>
                
                {/* product single view modal */}
                <Modal
                    open={modalActive}
                    onClose={handleModalChange}
                    title={activeProduct?.title}
                >
                  <Modal.Section>
                          <img src={activeProduct?.image} style={{width: "200px", margin: "0 auto", display: "block"}}/>
                  </Modal.Section>
                  <Modal.Section>
                      <TextContainer>
                          <Heading>Description</Heading>
                          <p>{activeProduct?.description}</p>
                      </TextContainer>
                  </Modal.Section>
                  <Modal.Section>
                      <TextContainer>
                          <Heading>Rating</Heading>
                          <p><TextStyle variation="strong">Rating : </TextStyle>{activeProduct?.rating?.rate}</p>
                          <p><TextStyle variation="strong">Rated by : </TextStyle>{activeProduct?.rating?.count}</p>
                      </TextContainer>
                  </Modal.Section>
                </Modal>
                
            </Page>
        </AppProvider>
    )
}

// pre-render with props
export async function getStaticProps ({ params })
{
    const req = await fetch(`https://fakestoreapi.com/products`);
    const data = await req.json();

    return {
        props: { products: data },
    };
}


// fuctions
const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
};

function disambiguateLabel(key, value) {
    switch (key) {
        case 'moneySpent':
        return `Money spent is between $${value[0]} and $${value[1]}`;
        case 'taggedWith':
        return `Tagged with ${value}`;
        case 'accountStatus':
        return value.map((val) => `Customer ${val}`).join(', ');
        default:
        return value;
    }
}

function isEmpty(value) {
    if (Array.isArray(value)) {
        return value.length === 0;
    } else {
        return value === '' || value == null;
    }
}