module.exports = (function() {

  'use strict';

  const Nodal = require('nodal');
  const pg = require('pg');
  const HouseListing = Nodal.require('app/models/house_listing.js');

  const AuthController = Nodal.require('app/controllers/auth_controller.js');

  class V1HouseListingsController extends AuthController {

    index() {

      HouseListing.query()
        .join('user')
        .where(this.params.query)
        .end((err, models) => {

          this.respond(err || models,
            ['id',
             'user_id',
             'house_name',
             'heading',
             'street_add',
             'city',
             'state',
             'zipcode',
             'price',
             'dates_avail',
             'house_interests',
             'house_mission',
             'house_rules',
             'vacancies',
             'primary_member',
             'created_at',
             'updated_at',
             'pics',
             {
               user:
               ['id','username','first_name','avatar']
             }
          ]);

        });

    }

    show() {

      HouseListing.find(this.params.route.id, (err, model) => {

        this.respond(err || model);

      });

    }

    create() {

      this.authorize((accessToken, user) => {

        this.params.body.user_id = user.get('id');

        HouseListing.create(this.params.body, (err, model) => {

          this.respond(err || model);

        });

      });

    }

    update() {

      this.authorize((accessToken, user) => {

        HouseListing.update(this.params.route.id, this.params.body, (err, model) => {

          this.respond(err || model);

        });

      });

    }

    destroy() {

      this.authorize((accessToken, user) => {

        HouseListing.destroy(this.params.route.id, (err, model) => {

          this.respond(err || model);

        });

      });

    }

  }

  return V1HouseListingsController;

})();
