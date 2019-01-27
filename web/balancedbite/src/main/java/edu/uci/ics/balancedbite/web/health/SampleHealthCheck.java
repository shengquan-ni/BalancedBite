package edu.uci.ics.balancedbite.web.health;

import com.codahale.metrics.health.HealthCheck;

public class SampleHealthCheck extends HealthCheck {

	@Override
	protected Result check() throws Exception {
		// TODO Auto-generated method stub
		return Result.healthy();
	}

}
