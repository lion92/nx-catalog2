import React, {useCallback, useEffect, useState} from 'react';
import Graph from "./Graph";
import lien from './lien'
import Calendar from 'react-calendar';
import GraphParDate from "./GraphParDate";
import ProgressBar from "@ramonak/react-progress-bar";
import {RiMoneyEuroCircleFill, RiPassPendingLine} from "react-icons/ri";
import {BiCategory} from "react-icons/bi";
import {MdOutlineDescription} from "react-icons/md";
import {CiCalendarDate, CiCircleRemove} from "react-icons/ci";
import {GrAddCircle} from "react-icons/gr";
import {RxUpdate} from "react-icons/rx";


export function Budget(props) {


    {
        let [actionDescription, setActionDescription] = useState("");
        let [idMontant, setIdMontant] = useState(-1);
        let [montant, setMontant] = useState(0);
        let [montantError, setMontantError] = useState(0);
        let [actionCategorieError, setActionCategorieError] = useState("");
        let [actionCategorie, setActionCategorie] = useState("");
        let [actionDescriptionError, setActionDescriptionError] = useState("");
        let [valueInput, setValue] = useState("");
        let [valueInputDescription, setDescription] = useState("");
        let [idVal, setId] = useState(-1);
        let [textp, setText] = useState([]);
        let [textCat, setTextCat] = useState([]);
        let [montantTotal, setMontantTotal] = useState(0);
        let [textCat2, setTextCat2] = useState([]);
        const [load, setLoad] = useState(false);
        const [datePick, onChangeDatePick] = useState(new Date());
        const [montantCSS, setMontantCSS] = useState("hidden");
        const [budget, setBudget] = useState(0);
        const [budgetCSS, setBudgetCSS] = useState("hidden");
        const [categorieCSS, setCategorieCSS] = useState("hidden");
        const [descriptionCSS, setDescriptionCSS] = useState("hidden");
        const [dateCSS, setDateCSS] = useState("hidden");
        const [buttonCSS, setbuttonCSS] = useState("hidden");
        const [selectv, setselectedtv] = useState("");


        const data = {
            labels: textCat2.map(value => value.categorie),
            datasets: [
                {
                    label: 'Montant par catégorie',
                    data: textCat2.map(value => value.montant),
                    backgroundColor: textCat2.map(value => value.color),
                    borderColor: 'black',

                }
            ]
        };
        const dataParDate = {
            type: 'line',
            scales: {
                x: {
                    type: 'time',
                    time: {
                        // Luxon format string
                        tooltipFormat: 'DD T'
                    },
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'value'
                    }
                }
            },
            labels: textp.map(value => value.description + "" + value.dateTransaction),
            datasets: [{
                label: "Depense par date",
                backgroundColor: 'pink',
                borderColor: 'red',
                fill: false,
                data: textp.map(value => {
                    return {x: value.dateTransaction, y: value?.montant}
                }),
            }]
        };


        const fetchAPICat2 = useCallback(async () => {
            let idUser = parseInt("" + localStorage.getItem("utilisateur"))
            const response = await fetch(lien.url + "action/categorie/sum/byUser/" + idUser);
            const resbis = await response.json();
            await setTextCat2(resbis);

            return resbis;
        }, [setTextCat2]);

        const fetchAPICat = useCallback(async () => {
            let idUser = parseInt("" + localStorage.getItem("utilisateur"))
            const response = await fetch(lien.url + "categorie/byuser/" + idUser);
            const resbis = await response.json();
            await setTextCat(resbis);

            return resbis;
        }, [setText]);

        let idCategorie = (data) => {
            let str = "" + data
            str = str.split(" ")[0];
            setActionCategorie(str);
        };
        let attendre = () => {
            setLoad(true);
            setTimeout(() => {
                setLoad(false);
            }, 2000);
            console.log(load);
        };
        useEffect(() => {
            attendre();
            fetchAPI();
            fetchAPICat();
            fetchAPICat2();
        }, []);
        ////////////////////////Rechercher/////////////
        let recherche = async (e) => {
            e.preventDefault();
            if (montant === 0) {
                let f = await fetchAPI();
                await setText(f);
            } else {
                let f = await fetchAPI();
                await console.log(f);
                let tab = await f.filter((elemt) => {
                        return ("" + elemt.montant === "" + montant)
                    }
                );
                await setText(tab);
            }

            fetchAPICat2();
        };


        async function filterByMonth(monthNum) {


            let month=["Janvier","Fevrier","Mars","Avril","Mai","Juin","Juillet","Aout", "Septembre","Octobre","Novembre","Decembre"];
            let tout=await fetchAPI().then(value => value.filter(value2 => (value2.dateTransaction.toString().split("-")[1]) == (month.indexOf(monthNum)+1)));
            await setText(await fetchAPI().then(value => value.filter(value2 => (value2.dateTransaction.toString().split("-")[1]) == (month.indexOf(monthNum)+1))));

            await setMontantTotal(tout.map(val => val.montant).reduce(function (a, b) {
                return a + b;
            }, 0))
        }

        ////////////////////////////////////////////
        ///////////////////fectchApi/////////////////////////
        const fetchAPI = useCallback(async () => {
            let idUser = parseInt("" + localStorage.getItem("utilisateur"))
            const response = await fetch(lien.url + "action/byuser/" + idUser);
            const resbis = await response.json();
            await setText(resbis);
            setMontantTotal(resbis.map(val => val.montant).reduce(function (a, b) {
                return a + b;
            }, 0))
            return resbis;
        }, [setText]);


        const getData = async (e) => {
            e.preventDefault();
            let idUser = parseInt("" + localStorage.getItem("utilisateur"));
            fetch(lien.url + "action/export/" + idUser)
                .then(res => res.blob())
                .then(blob => {
                    var file = window.URL.createObjectURL(blob);
                    window.location.assign(file);
                });
        }


        /////////////////////////////////////////
        ///////////////remonter au parent//////////////////////////////iddata/////////
        let idchange = (data) => {
            setId(data);
        };
        //////////////////////////appel api en debut
        useEffect(() => {
            fetchAPI();
        }, []);
        ////////////////////////////////////////supprimme des tache
        let del = (e, data) => {
            e.preventDefault();
            fetchdelete(data);
        };
        ///////////////////////////////////////////////////////////remonter le texte
        let textebis = (data) => {
            setValue(data);
        };
        ///////////////////////////////////////////////////////////remonter le texte
        let textebisDesc = (data) => {
            setDescription(data);
        };
        /////////////////////////////
        ///////////////////////////appel delete
        let fetchdelete = useCallback(async (data) => {
            let idTodo = parseInt(data, 10)
            const response = await fetch(
                lien.url + "action/" + idTodo,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const resbis = await response;
            await fetchAPI();
            await fetchAPICat2()
        });
        //////////////////////insert tache
        let fetchCreer = useCallback(async (e) => {

            e.preventDefault();
            const response = await fetch(
                lien.url + "action",
                {
                    method: "POST",
                    body: JSON.stringify({
                        montant: montant,
                        categorie: actionCategorie,
                        description: actionDescription,
                        user: parseInt("" + localStorage.getItem("utilisateur")),
                        dateTransaction: datePick.toLocaleString("zh-CN",{ timeZone: 'Europe/Paris' })
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const resbis = await response;
            await fetchAPI();
            fetchAPICat2();

        });
        ////////////////////update////////////
        let fetchAPIupdate = useCallback(async () => {
            const response = await fetch(
                lien.url + "action/" + idMontant,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        categorie: actionCategorie,
                        description: actionDescription,
                        montant: montant,
                        user: parseInt("" + localStorage.getItem("utilisateur")),
                        dateTransaction: datePick.toLocaleString("zh-CN",{ timeZone: 'Europe/Paris' })
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const resbis = await response;
            await fetchAPI();
            fetchAPICat2();
        });
        ////////////////////////input change value
        let Valuechange = (e) => {
            let a = e.target.value;
            console.log(a);

            if (valueInput.length > 20) {


            } else {

            }
            setValue(a);
            return a;
        };
        ////////////////////////input change description
        let valueChangeDescription = (e) => {
            let a = e.target.value;
            console.log(a);

            if (valueInputDescription.length > 50) {

            } else {


            }
            return a;
        };
        /////////////////////////modifier
        let modifier = (e) => {
            e.preventDefault();
            fetchAPIupdate();
            setValue("");

        };
        let calcul = () => {
            if (montantTotal !== 0) {
                if (budget !== 0) {
                    return ((montantTotal * 100) / budget) * 100
                } else {
                    return 1
                }
            } else {
                return 0;
            }

        };

        function setIdCat(option) {
            setActionCategorie(option.id);

        };
        /////////////////////////modifier
        let deleteMontant = (e) => {
            e.preventDefault();
            fetchdelete(idMontant);
            setValue("");

        };


        /////////////////////////
        return (
            <div>
                <div>
                    <button onClick={() => {
                        if (budgetCSS === "visible") {

                            setBudgetCSS("hidden")
                        } else {
                            setBudgetCSS("visible");
                        }
                    }}>Ajouter un budget
                        <RiMoneyEuroCircleFill style={{fontSize:"5em", color:'blueviolet'}}/>
                    </button>
                    <input className={budgetCSS} value={budget} onChange={(e) => setBudget(e.target.value)}/>
                    <p className={budgetCSS}>
                    </p>

                    <ProgressBar className={budgetCSS} completed={calcul() / 100}
                    />
                </div>
                <div>
                    <div>

                        <div>
                            <div className="cache">
                                <input value={idMontant} onChange={(e) => setIdMontant(e.target.value)}/>{" "}
                            </div>
                            <div className="containerCote">
                                <button onClick={(e) => {
                                    e.preventDefault();
                                    if (categorieCSS === "visible") {

                                        setCategorieCSS("hidden")
                                    } else {
                                        setCategorieCSS("visible");
                                    }
                                }}>Ajouter une categorie
                                    <BiCategory style={{fontSize:'5em',color:'blueviolet'}}/>
                                </button>
                                <p className={categorieCSS}>{actionCategorie}</p>
                                <div className={categorieCSS}>
                                    {textCat.map((option, index) => {
                                        return <h1 className="but1" onClick={() => {
                                            setIdCat(option)
                                        }}
                                                   key={option.id}>
                                            {option.id + " " + option.categorie}


                                        </h1>
                                    })}
                                </div>
                                <p className="error">{actionCategorieError}</p>
                            </div>
                        </div>
                        <div>

                            <button onClick={(e) => {
                                e.preventDefault();
                                if (descriptionCSS === "visible") {

                                    setDescriptionCSS("hidden")
                                } else {
                                    setDescriptionCSS("visible");
                                }
                            }}>Ajouter une description
                                <MdOutlineDescription style={{fontSize:'5em',color:'blueviolet'}}/>
                            </button>
                            <div>
                                <input className={descriptionCSS} value={actionDescription}
                                       onChange={(e) => setActionDescription(e.target.value)}/>{" "}
                                <p className="error">{actionDescriptionError}</p>
                            </div>
                        </div>
                        <div className="containerCote">
                            <button onClick={(e) => {
                                e.preventDefault();
                                if (montantCSS === "visible") {

                                    setMontantCSS("hidden")
                                } else {
                                    setMontantCSS("visible");
                                }
                            }}>Ajouter un montant
                                <RiPassPendingLine style={{fontSize:'5em',color:'blueviolet'}}/>
                            </button>
                            <div>
                                <input className={montantCSS} value={montant}
                                       onChange={(e) => setMontant(e.target.value)}/>{" "}
                                <p className={montantCSS + " " + "error"}>{montant}</p>
                            </div>
                        </div>
                        <button onClick={(e) => {
                            e.preventDefault();
                            if (dateCSS === "visible") {

                                setDateCSS("hidden")
                            } else {
                                setDateCSS("visible");
                            }
                        }}>Ajouter une date
                            <CiCalendarDate style={{fontSize:'5em',color:'blueviolet'}}/>
                        </button>
                        <div className="containerCote">


                            <div className={dateCSS}>
                                <div className={dateCSS}>{datePick.toLocaleString("zh-CN",{ timeZone: 'Europe/Paris' })}</div>
                                <Calendar className={dateCSS} onChange={onChangeDatePick} value={datePick.toLocaleString("zh-CN",{ timeZone: 'Europe/Paris' })}/>
                            </div>
                        </div>
                        <div className="containerCote">
                            <button onClick={(e) => {
                                e.preventDefault();
                                if (buttonCSS === "visible") {

                                    setbuttonCSS("hidden")
                                } else {
                                    setbuttonCSS("visible");
                                }
                            }}>Acceder aux bouttons
                            </button>
                            <div className={buttonCSS}>
                                <button onClick={fetchCreer}>creer <GrAddCircle style={{fontSize:'5em',color:'blueviolet'}}/></button>
                                <button onClick={modifier}>modifier <RxUpdate style={{fontSize:'3.83em',color:'blueviolet'}}/></button>

                                <div>
                                    <button onClick={deleteMontant}><CiCircleRemove style={{fontSize:'5em',color:'blueviolet'}}/>Supprimer</button>
                                </div>
                                <button onClick={getData}>Download</button>
                            </div>
                        </div>
                        <div>

                        </div>

                    </div>


                </div>
                <div>
                    <select onChange={async (e) => {await filterByMonth(e.target.value)}}
                            className='form-select'>
                        <option >Janvier</option>
                        <option>Fevrier</option>
                        <option >Mars</option>
                        <option >Avril</option>
                        <option >Mai</option>
                        <option>Juin</option>
                        <option >Juillet</option>
                        <option >Aout</option>
                        <option >Septembre</option>
                        <option >Octobre</option>
                        <option >Novembre</option>
                        <option >Decembre</option>


                    </select>
                </div>

                <div>
                    <table>
                        <thead>
                        <tr>
                            <th>Id</th>
                            <th>Montant</th>
                            <th>Description</th>
                            <th>Categorie Id</th>
                            <th>Categorie</th>
                            <th>Date de la dépense</th>
                            <th>Date d'ajout</th>
                        </tr>
                        </thead>
                        <tbody>

                        {textp.map((item, index) => {
                            return (
                                <>
                                    <tr onClick={() => {
                                        setIdMontant(item.id);
                                        setMontant(item.montant);
                                        setActionDescription(item.description);
                                    }}>
                                        <th>{item.id}</th>
                                        <th className="montant">{item.montant}</th>
                                        <th className="description">{item.description}</th>
                                        <th className="description">{item.categorieId}</th>
                                        <th className="description">{item.categorie}</th>
                                        <th className="description">{item.dateTransaction}</th>
                                        <th className="description">{item.dateAjout}</th>

                                    </tr>
                                </>
                            );
                        })}
                        </tbody>
                        <tfoot>
                        <tr>
                            <th scope="row" colSpan="2"></th>
                            <td colSpan="2">montantTotal{montantTotal}</td>
                        </tr>
                        </tfoot>
                    </table>


                </div>
                <div>
                    <Graph data={data}></Graph>
                    <GraphParDate data={dataParDate}></GraphParDate>
                </div>
            </div>

        );
    }
}

export default Budget;