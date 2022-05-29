const db = require("../models");
const Tutorial = db.tutorials;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    if(!req.body.title){
        res.status(400).send({
            message: "Content cannot be empty!"
        });
        return;
    }
    const tutorial = {
        title: req.body.title,
        description: req.body.description,
        published: req.body.published ? req.body.published: false
    };
    db.tutorials.create(tutorial).then(data => {
        res.send(data)
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some errr occured while creating tutorial"
        });
    });
}

exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: {[Op.iLike]: `%${title}%` } }: null;
    Tutorial.findAll({ where: condition }).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({message: err.message || "Some error occurred while reteriving tutorials "
    });
    });
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    Tutorial.findByPk(id).then(
        data => {
            if (data){
                res.send(data);
            }else{
                res.status(404).send({
                    message: `Cannot find Tutorial with id=${id}`
                })
            }

        }).catch(err => {
            res.status(500).send({
                message: "Error Reteriving tutorial with id="+ id
            })
        })
}

exports.update = (req, res) => {
    const id = req.params.id;
    Tutorial.update(req.body, {
        where:{id: id}
    }).then(num => {
        if (num == 1){
            res.send({
                message: "Tutorial was updated successfully"
            });
        }else{
            res.send({message: `Cannot updated tutorial with id=${id}. Maybe Tutorial was not found!`
        });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete tutorial with id" + id
        });
    });
},

exports.delete = (req, res) => {
    const tutorial_id = req.params.id;
    Tutorial.destroy({
        where:{id: tutorial_id}
    }).then(num => {
        if(num==1){
            res.send({
                message: "Tutorial was deleted successfully"
            });
        }else{
            res.send({
                message: `Cannot deleted Tutorial with id= ${tutorial_id}. may be tutorial was not found`
            })
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete Tutrial with id" + tutorial_id
        })
    })

},

exports.deleteAll = (req, res) => {
    const id = req.params.id;
    Tutorial.destroy({where:{}}).then(num => {
        if(num==1){
            res.send({message: `${num} Tutorial was deleted successfully`
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some errors occured while removing all tutorials"

            })
            
        })
        }
    })
},

exports.findAllPublished = (req, res) =>{
    Tutorial.findAll({where: {published: true}}).then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occured while retriving tutorials"
        })
    })

}

