<template>
	<div class="detail" v-if="biddingData">
		<el-breadcrumb separator="/" class="breadcrumb">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item :to="`/bid/list?category=${biddingData.category}`">投标列表页</el-breadcrumb-item>
			<el-breadcrumb-item>投标详情页</el-breadcrumb-item>
		</el-breadcrumb>

		<div style="text-align: right;">
			<el-button @click="handlePrint()">打印</el-button>
			<el-button @click="changeFont(40)">大</el-button>
			<el-button @click="changeFont(30)">中</el-button>
			<el-button @click="changeFont(20)">小</el-button>
		</div>

		<div class="print-element" :style="{ fontSize }">
			<div style="font-weight: 600; line-height: 2em; text-align: center;"> {{ biddingData.bidTitle }}</div>
			<div style="line-height: 2em; text-align: center;">
				<span style="color: #333333; padding-right: 3em;">发布企业：<span style="color: #666666">{{
					biddingData.bidPublisher }}</span></span>
				<span style="color: #333333; padding-right: 3em;">创建时间：<span style="color: #666666">{{
					biddingData.bidPublishDatetime }}</span></span>
				<span style="color: #333333">浏览次数：<span style="color: #666666">{{ biddingData.viewCount ?
					biddingData.viewCount : 0 }}</span></span>
			</div>
			<div class="bidContent"
				style="line-height: 2em; width: max(70%, 540px); margin: auto; white-space: pre-line; text-align: left;"
				v-html="biddingData.bidContent" />
		</div>
	</div>

</template>

<script>
import { getBidding, viewBidding } from '@/api/bid/bidding'

export default {
	name: 'detail',
	data() {
		return {
			biddingData: undefined,
			fontSize: '20px'
		}
	},
	async mounted() {
		this.biddingData = (await getBidding(this.$route.query.id)).data
		if (this.biddingData) {
			await viewBidding(this.biddingData.id)
		}
	},
	methods: {
		handlePrint() {
			print()
		},
		changeFont(size) {
			this.fontSize = size + 'px'
		}
	}
}
</script>

<style lang="scss" scoped></style>
